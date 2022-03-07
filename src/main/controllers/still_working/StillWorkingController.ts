import { Response } from 'express';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from '../helpers';
export default class StillWorkingController {
  private readonly form: Form;

  constructor(private readonly stillWorkingContent: FormContent) {
    this.form = new Form(<FormFields>this.stillWorkingContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    const redirectUrl = PageUrls.JOB_TITLE;
    handleSessionErrors(req, res, this.form, redirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.stillWorkingContent, [
      TranslationKeys.COMMON,
      TranslationKeys.STILL_WORKING,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.STILL_WORKING, {
      ...content,
    });
  };
}

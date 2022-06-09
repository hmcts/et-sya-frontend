import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class WhistleblowingClaimsController {
  private readonly form: Form;
  private readonly whistleblowingClaimsFormContent: FormContent = {
    fields: {},
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.whistleblowingClaimsFormContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.HOME);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.whistleblowingClaimsFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.WHISTLEBLOWING_CLAIMS,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.WHISTLEBLOWING_CLAIMS, {
      ...content,
    });
  };
}

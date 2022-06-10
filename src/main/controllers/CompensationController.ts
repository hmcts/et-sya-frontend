import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class CompensationController {
  private readonly form: Form;
  private readonly compensationFormContent: FormContent = {
    fields: {},
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.compensationFormContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.TRIBUNAL_RECOMMENDATION);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.compensationFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.COMPENSATION,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.COMPENSATION, {
      ...content,
    });
  };
}

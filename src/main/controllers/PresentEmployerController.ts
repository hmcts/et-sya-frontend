import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { DefaultRadioFormFields, saveForLaterButton, submitButton } from '../definitions/radios';

import { assignFormData, conditionalRedirect, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class PresentEmployerController {
  private readonly form: Form;
  private readonly presentEmployerFormContent: FormContent = {
    fields: {
      presentEmployer: {
        ...DefaultRadioFormFields,
        id: 'present-employer',
        classes: 'govuk-radios',
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.presentEmployerFormContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    const redirectUrl = conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES)
      ? PageUrls.JOB_TITLE
      : PageUrls.HOME;
    // TODO: Change to the correct redirect url - Employment Details
    // NO - Respondent details
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, redirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.presentEmployerFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.PRESENT_EMPLOYER,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.PRESENT_EMPLOYER, {
      ...content,
    });
  };
}

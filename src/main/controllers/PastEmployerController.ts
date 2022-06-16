import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { DefaultRadioFormFields, saveForLaterButton, submitButton } from '../definitions/radios';

import { assignFormData, conditionalRedirect, getPageContent, handleSessionErrors, setUserCase } from './helpers';
let employmentStatus: string;

export default class PastEmployerController {
  private readonly form: Form;
  private readonly pastEmployerFormContent: FormContent = {
    fields: {
      pastEmployer: {
        ...DefaultRadioFormFields,
        id: 'past-employer',
        classes: 'govuk-radios--inline',
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.pastEmployerFormContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    const redirectUrl = conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES)
      ? PageUrls.STILL_WORKING
      : PageUrls.HOME;
    // TODO: Change to the correct redirect urls
    // NO - Respondent details
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, redirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    if (req.session.userCase.typeOfClaim.includes('unfairDismissal')) {
      employmentStatus = TranslationKeys.STILL_WORKING;
    } else {
      employmentStatus = TranslationKeys.PAST_EMPLOYER;
    }
    const content = getPageContent(req, this.pastEmployerFormContent, [TranslationKeys.COMMON, employmentStatus]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(employmentStatus, {
      ...content,
    });
  };
}

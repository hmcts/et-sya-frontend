import { Response } from 'express';
import { LoggerInstance } from 'winston';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { DefaultRadioFormFields, saveForLaterButton, submitButton } from '../definitions/radios';
import { getCaseApi } from '../services/CaseService';

import { assignFormData, conditionalRedirect, getPageContent, handleSessionErrors, setUserCase } from './helpers';

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

  constructor(private logger: LoggerInstance) {
    this.form = new Form(<FormFields>this.pastEmployerFormContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    const session = req.session;
    const redirectUrl = conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES)
      ? PageUrls.STILL_WORKING
      : PageUrls.RESPONDENT_NAME;
    // NO - Respondent details
    setUserCase(req, this.form);
    getCaseApi(session.user?.accessToken)
      .updateDraftCase(session.userCase)
      .then(() => {
        this.logger.info(`Updated draft case id: ${session.userCase.id}`);
      })
      .catch(error => {
        this.logger.info(error);
      });
    handleSessionErrors(req, res, this.form, redirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.pastEmployerFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.PAST_EMPLOYER,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.PAST_EMPLOYER, {
      ...content,
    });
  };
}

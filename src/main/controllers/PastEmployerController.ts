import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { DefaultRadioFormFields, saveForLaterButton, submitButton } from '../definitions/radios';
import { getCaseApi } from '../services/CaseService';

import { assignFormData, conditionalRedirect, getPageContent, handleSessionErrors, setUserCase } from './helpers';

const { Logger } = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('app');

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
    getCaseApi(req.session.user?.accessToken)
      .updateDraftCase(req.session.userCase)
      .then(() => {
        logger.info(`Updated draft case id: ${req.session.userCase.id}`);
      })
      .catch(error => {
        logger.info(error);
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

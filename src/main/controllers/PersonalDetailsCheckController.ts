import { Response } from 'express';
import { LoggerInstance } from 'winston';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { DefaultRadioFormFields, saveForLaterButton, submitButton } from '../definitions/radios';
import { getCaseApi } from '../services/CaseService';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class PersonalDetailsCheckController {
  private readonly form: Form;
  private readonly personalDetailsCheckContent: FormContent = {
    fields: {
      personalDetailsCheck: {
        ...DefaultRadioFormFields,
        id: 'tasklist-check',
        classes: 'govuk-radios',
        validator: isFieldFilledIn,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor(private logger: LoggerInstance) {
    this.form = new Form(<FormFields>this.personalDetailsCheckContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    const requestSession = req.session;
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.CLAIM_STEPS);
    if (!req.session.errors.length) {
      getCaseApi(requestSession.user?.accessToken)
        .updateDraftCase(requestSession.userCase)
        .then(() => {
          this.logger.info(`Updated draft case id: ${requestSession.userCase.id}`);
        })
        .catch(error => {
          this.logger.error(error);
        });
    }
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.personalDetailsCheckContent, [
      TranslationKeys.COMMON,
      TranslationKeys.TASK_LIST_CHECK,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.TASK_LIST_CHECK, {
      ...content,
    });
  };
}

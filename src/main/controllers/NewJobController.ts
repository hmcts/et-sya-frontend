import { Response } from 'express';
import { LoggerInstance } from 'winston';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { DefaultInlineRadioFormFields, RadioFormFields, saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';

import {
  assignFormData,
  conditionalRedirect,
  getPageContent,
  handleSessionErrors,
  handleUpdateDraftCase,
  setUserCase,
} from './helpers';

const new_job: RadioFormFields = {
  ...DefaultInlineRadioFormFields,
  label: (l: AnyRecord): string => l.h1,
  labelHidden: true,
  id: 'new-job',
};

export default class NewJobController {
  private readonly form: Form;
  private readonly newJobContent: FormContent = {
    fields: {
      newJob: new_job,
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor(private logger: LoggerInstance) {
    this.form = new Form(<FormFields>this.newJobContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    const redirectUrl = conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES)
      ? PageUrls.NEW_JOB_START_DATE
      : PageUrls.FIRST_RESPONDENT_NAME;
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, redirectUrl);
    handleUpdateDraftCase(req, this.logger);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.newJobContent, [TranslationKeys.COMMON, TranslationKeys.NEW_JOB]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.NEW_JOB, {
      ...content,
    });
  };
}

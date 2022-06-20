import { Response } from 'express';

import { Form } from '../components/form/form';
import { isJobTitleValid } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getCaseApi } from '../services/CaseService';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

const { Logger } = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('app');

export default class JobTitleController {
  private readonly form: Form;
  private readonly jobTitleContent: FormContent = {
    fields: {
      jobTitle: {
        id: 'job-title',
        name: 'job-title',
        type: 'text',
        classes: 'govuk-!-width-one-half',
        label: (l: AnyRecord): string => l.jobTitle,
        hint: (l: AnyRecord): string => l.hint,
        attributes: {
          autocomplete: 'organization-title',
        },
        validator: isJobTitleValid,
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.submit,
      classes: 'govuk-!-margin-right-2',
    },
    saveForLater: {
      text: (l: AnyRecord): string => l.saveForLater,
      classes: 'govuk-button--secondary',
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.jobTitleContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    getCaseApi(req.session.user?.accessToken)
      .updateDraftCase(req.session.userCase)
      .then(() => {
        logger.info(`Updated draft case id: ${req.session.userCase.id}`);
      })
      .catch(error => {
        logger.info(error);
      });

    handleSessionErrors(req, res, this.form, PageUrls.START_DATE);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.jobTitleContent, [TranslationKeys.COMMON, TranslationKeys.JOB_TITLE]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.JOB_TITLE, {
      ...content,
    });
  };
}

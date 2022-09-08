import { Response } from 'express';
import { LoggerInstance } from 'winston';

import { Form } from '../components/form/form';
import { isRespondentNameValid } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import {
  assignFormData,
  getPageContent,
  getRespondentIndex,
  getRespondentRedirectUrl,
  handleSaveAsDraft,
  handleSessionErrors,
  handleUpdateDraftCase,
  setUserCaseForRespondent,
} from './helpers';

export default class RespondentNameController {
  private readonly form: Form;
  private readonly respondentNameContent: FormContent = {
    fields: {
      respondentName: {
        id: 'respondentName',
        name: 'respondentName',
        type: 'text',
        validator: isRespondentNameValid,
        label: (l: AnyRecord): string => l.label,
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

  constructor(private logger: LoggerInstance) {
    this.form = new Form(<FormFields>this.respondentNameContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    const { saveForLater } = req.body;
    if (saveForLater) {
      handleSaveAsDraft(res);
    } else {
      setUserCaseForRespondent(req, this.form);
      const redirectUrl = getRespondentRedirectUrl(req.params.respondentNumber, PageUrls.RESPONDENT_ADDRESS);
      handleSessionErrors(req, res, this.form, redirectUrl);
      handleUpdateDraftCase(req, this.logger);
    }
  };

  public get = (req: AppRequest, res: Response): void => {
    let respondentIndex: number;
    if (req.session.userCase?.respondents) {
      respondentIndex = getRespondentIndex(req);
    }

    const content = getPageContent(
      req,
      this.respondentNameContent,
      [TranslationKeys.COMMON, TranslationKeys.RESPONDENT_NAME],
      respondentIndex
    );
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.RESPONDENT_NAME, {
      ...content,
    });
  };
}

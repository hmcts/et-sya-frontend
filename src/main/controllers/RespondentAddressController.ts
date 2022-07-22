import { Response } from 'express';
import { LoggerInstance } from 'winston';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, getPageContent, handleSessionErrors, handleUpdateDraftCase, setUserCase } from './helpers';

export default class RespondentAddressController {
  private readonly form: Form;
  private readonly respondentAddressContent: FormContent = {
    fields: {},
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
    this.form = new Form(<FormFields>this.respondentAddressContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    const redirectUrl = req.session.userCase.respondents.length > 1 ? PageUrls.ACAS_CERT_NUM : PageUrls.WORK_ADDRESS;
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, redirectUrl);
    handleUpdateDraftCase(req, this.logger);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.respondentAddressContent, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPONDENT_ADDRESS,
    ]);
    const respondents = req.session.userCase.respondents;
    const selectedRespondent = respondents[req.session.userCase.selectedRespondent - 1];
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.RESPONDENT_ADDRESS, {
      ...content,
      respondentName: selectedRespondent.respondentName,
    });
  };
}

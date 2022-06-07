import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, getPageContent, handleSessionErrors, setUserCaseForNewRespondent } from './helpers';
//import { Respondent } from '../definitions/case';

export default class RespondentNameController {
  private readonly form: Form;
  private readonly respondentNameContent: FormContent = {
    fields: {
      respondentName: {
        id: 'respondent-name',
        name: 'respondent-name',
        type: 'text',
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

  constructor() {
    this.form = new Form(<FormFields>this.respondentNameContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCaseForNewRespondent(req);
    handleSessionErrors(req, res, this.form, PageUrls.RESPONDENT_ADDRESS);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.respondentNameContent, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPONDENT_NAME,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.RESPONDENT_NAME, {
      ...content,
    });
  };
}

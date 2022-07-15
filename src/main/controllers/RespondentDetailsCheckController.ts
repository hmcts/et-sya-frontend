import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, getPageContent, getRespondentRedirectUrl, handleSessionErrors } from './helpers';

export default class RespondentDetailsCheckController {
  private readonly form: Form;
  private readonly addRespondentForm: FormContent = {
    fields: {},
    submit: {
      text: (l: AnyRecord): string => l.submit,
      classes: 'govuk-button--secondary',
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.addRespondentForm.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    const respondents = req.session.userCase.respondents;
    const newRespondentNum = respondents.length + 1;
    if (newRespondentNum <= 6) {
      const newRespondent = {
        respondentNumber: newRespondentNum,
      };
      req.session.userCase.respondents.push(newRespondent);
    } else {
      // TODO Error handling
      console.log('Limit reached');
    }

    const redirectUrl = getRespondentRedirectUrl(newRespondentNum, PageUrls.RESPONDENT_NAME);

    handleSessionErrors(req, res, this.form, redirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    const respondents = req.session.userCase.respondents;
    const content = getPageContent(req, this.addRespondentForm, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPONDENT_DETAILS_CHECK,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.RESPONDENT_DETAILS_CHECK, {
      ...content,
      respondents,
    });
  };
}

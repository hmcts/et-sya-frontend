import { Response } from 'express';

import { Form } from '../components/form/form';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { setUrlLanguage } from './helpers/LanguageHelper';
import { getRespondentDetailsCardActionItem, getRespondentDetailsSection } from './helpers/RespondentAnswersHelper';
import { getRespondentRedirectUrl } from './helpers/RespondentHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

export default class RespondentDetailsCheckController {
  private readonly form: Form;
  private readonly addRespondentForm: FormContent = {
    fields: {
      hiddenErrorField: {
        id: 'hiddenErrorField',
        type: 'text',
        hidden: true,
      },
    },
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
    if (newRespondentNum > 5) {
      req.session.errors = [{ errorType: 'exceeded', propertyName: 'hiddenErrorField' }];
      return res.redirect(PageUrls.RESPONDENT_DETAILS_CHECK);
    } else {
      req.session.errors = [];
      const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_NAME);
      return res.redirect(getRespondentRedirectUrl(newRespondentNum, redirectUrl));
    }
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    const respondents = req.session.userCase.respondents;
    const translations: AnyRecord = { ...req.t(TranslationKeys.RESPONDENT_DETAILS_CHECK, { returnObjects: true }) };
    const content = getPageContent(req, this.addRespondentForm, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPONDENT_DETAILS_CHECK,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.RESPONDENT_DETAILS_CHECK, {
      ...content,
      respondents,
      translations,
      getRespondentDetailsSection,
      getRespondentDetailsCardActionItem,
      PageUrls,
      languageParam: getLanguageParam(req.url),
    });
  };
}

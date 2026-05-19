import { Response } from 'express';

import { Form } from '../components/form/form';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { getClaimantRespondentDetailsSection } from './helpers/RespondentAnswersHelper';
import { getLanguageParam } from './helpers/RouterHelpers';

export default class ClaimantRespondentDetailsCheckController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {},
    submit: {
      text: (l: AnyRecord): string => l.saveAndContinue,
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    const respondent = req.session.userCase?.respondents?.[0];
    const translations: AnyRecord = {
      ...req.t(TranslationKeys.CLAIMANT_RESPONDENT_DETAILS_CHECK, { returnObjects: true }),
    };
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIMANT_RESPONDENT_DETAILS_CHECK,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.CLAIMANT_RESPONDENT_DETAILS_CHECK, {
      ...content,
      respondent,
      translations,
      getClaimantRespondentDetailsSection,
      PageUrls,
      languageParam: getLanguageParam(req.url),
    });
  };
}

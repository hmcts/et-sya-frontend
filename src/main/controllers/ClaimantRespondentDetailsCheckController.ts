import { Response } from 'express';

import { validateEmploymentAndRespondentDetails } from '../components/form/claim-details-validator';
import { Form } from '../components/form/form';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { DefaultRadioFormFields, saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { getClaimantRespondentDetailsSection } from './helpers/RespondentAnswersHelper';
import { getClaimStepsUrl, getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('ClaimantRespondentDetailsCheckController');

export default class ClaimantRespondentDetailsCheckController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      employmentAndRespondentCheck: {
        ...DefaultRadioFormFields,
        label: (l: AnyRecord): string => l.legend,
        labelHidden: false,
        labelSize: 'xl',
        isPageHeading: false,
        hint: (l: AnyRecord): string => l.hint,
        id: 'employment-respondent-check',
        classes: 'govuk-radios',
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    if (req.body?.employmentAndRespondentCheck === 'Yes') {
      const userCase = req.session?.userCase;
      const isValid = validateEmploymentAndRespondentDetails(userCase);

      req.session.errors = [];
      if (!isValid) {
        req.session.errors.push({ propertyName: 'employmentAndRespondentCheck', errorType: 'invalid' });
        const respondent = req.session.userCase?.respondents?.[0];
        const translations: AnyRecord = {
          ...req.t(TranslationKeys.CLAIMANT_RESPONDENT_DETAILS_CHECK, { returnObjects: true }),
        };
        const content = getPageContent(req, this.formContent, [
          TranslationKeys.COMMON,
          TranslationKeys.CLAIMANT_RESPONDENT_DETAILS_CHECK,
        ]);
        return res.render(TranslationKeys.CLAIMANT_RESPONDENT_DETAILS_CHECK, {
          ...content,
          respondent,
          translations,
          getClaimantRespondentDetailsSection,
          PageUrls,
          languageParam: getLanguageParam(req.url),
        });
      }
    }

    await handlePostLogic(req, res, this.form, logger, getClaimStepsUrl(req));
  };

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

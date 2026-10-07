import { Response } from 'express';

import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { CheckAnswersValidationCheck } from '../decorators/CheckAnswersValidationCheck';
import { AppRequest } from '../definitions/appRequest';
import { FEATURE_FLAGS, InterceptPaths, PageUrls, TranslationKeys } from '../definitions/constants';
import { AnyRecord } from '../definitions/util-types';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

import { getClaimDetails } from './helpers/ClaimDetailsAnswersHelper';
import { getEmploymentDetails } from './helpers/EmploymentAnswersHelper';
import { getGroupClaimDetails } from './helpers/GroupClaimDetailsAnswersHelper';
import { getRespondentSection, respondentTitle } from './helpers/RespondentAnswersHelper';
import { setNumbersToRespondents } from './helpers/RespondentHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';
import { getYourDetails } from './helpers/YourDetailsAnswersHelper';

export default class CheckYourAnswersController {
  @CaseStateCheck()
  @CheckAnswersValidationCheck()
  public async get(req: AppRequest, res: Response): Promise<void> {
    if (!req.session || !req.session.userCase) {
      return res.redirect(PageUrls.CLAIMANT_APPLICATIONS);
    }
    const userCase = req.session?.userCase;
    const eraOctober2026Enabled = await getFlagValue(FEATURE_FLAGS.ERA_OCTOBER_2026, null);
    req.session.respondentRedirectCheckAnswer = undefined;

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.CHECK_ANSWERS, { returnObjects: true }),
      ...req.t(TranslationKeys.ET1_DETAILS, { returnObjects: true }),
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    };

    const newRespondentNum =
      req.session.userCase.respondents === undefined ? undefined : req.session.userCase.respondents.length + 1;

    setNumbersToRespondents(userCase.respondents);

    const {
      metaRows: groupClaimMetaRows,
      cardsHtml: groupClaimCardsHtml,
      postRows: groupClaimPostRows,
    } = getGroupClaimDetails(userCase, translations);

    res.render(TranslationKeys.CHECK_ANSWERS, {
      ...translations,
      PageUrls,
      translations,
      userCase,
      respondents: req.session.userCase?.respondents,
      InterceptPaths,
      typesOfClaim: userCase.typeOfClaim,
      groupClaimMetaRows,
      groupClaimCardsHtml,
      groupClaimPostRows,
      yourDetails: getYourDetails(userCase, translations, eraOctober2026Enabled),
      employmentSection: getEmploymentDetails(userCase, translations),
      getRespondentSection,
      respondentTitle,
      claimDetailsSection: getClaimDetails(userCase, translations),
      errors: req.session.errors,
      languageParam: getLanguageParam(req.url),
      isAddRespondent: newRespondentNum <= 5,
    });
  }
}

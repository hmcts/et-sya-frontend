import { Response } from 'express';

import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { FEATURE_FLAGS, InterceptPaths, PageUrls, TranslationKeys } from '../definitions/constants';
import { AnyRecord } from '../definitions/util-types';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

import {
  getClaimantClaimDetails,
  getClaimantPersonalDetails,
  getClaimantRespondentSection,
  getRepresentativeDetails,
} from './helpers/ClaimantRepAnswersHelper';
import { getLanguageParam } from './helpers/RouterHelpers';

export default class ClaimantRepCheckAnswersController {
  @CaseStateCheck()
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    if (!req.session?.userCase) {
      return res.redirect(PageUrls.CLAIMANT_APPLICATIONS);
    }

    const userCase = req.session.userCase;
    const eraOctober2026Enabled = await getFlagValue(FEATURE_FLAGS.ERA_OCTOBER_2026, null);

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.ET1_DETAILS, { returnObjects: true }),
      ...req.t(TranslationKeys.CLAIMANT_REP_CHECK_ANSWERS, { returnObjects: true }),
    };

    const respondents = userCase.respondents ?? [];
    const languageParam = getLanguageParam(req.url);

    res.render(TranslationKeys.CLAIMANT_REP_CHECK_ANSWERS, {
      ...translations,
      translations,
      PageUrls,
      InterceptPaths,
      userCase,
      languageParam,
      representativeDetails: getRepresentativeDetails(userCase, translations, eraOctober2026Enabled),
      claimantPersonalDetails: getClaimantPersonalDetails(userCase, translations),
      respondents,
      getClaimantRespondentSection,
      claimDetailsRows: getClaimantClaimDetails(userCase, translations, eraOctober2026Enabled),
      errors: req.session.errors,
    });
  };
}

import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { InterceptPaths, PageUrls, TranslationKeys } from '../definitions/constants';
import { AnyRecord } from '../definitions/util-types';

import {
  getClaimantClaimDetails,
  getClaimantPersonalDetails,
  getClaimantRespondentSection,
  getRepresentativeDetails,
} from './helpers/ClaimantRepAnswersHelper';
import { getLanguageParam } from './helpers/RouterHelpers';

export default class ClaimantRepCheckAnswersController {
 @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    if (!req.session?.userCase) {
      return res.redirect(PageUrls.CLAIMANT_APPLICATIONS);
    }

    const userCase = req.session.userCase;

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.CLAIMANT_REP_CHECK_ANSWERS, { returnObjects: true }),
      ...req.t(TranslationKeys.ET1_DETAILS, { returnObjects: true }),
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
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
      representativeDetails: getRepresentativeDetails(userCase, translations),
      claimantPersonalDetails: getClaimantPersonalDetails(userCase, translations),
      respondents,
      getClaimantRespondentSection,
      claimDetailsRows: getClaimantClaimDetails(userCase, translations),
    });
  };
}

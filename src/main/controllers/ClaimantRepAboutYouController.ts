import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { AnyRecord } from '../definitions/util-types';
import { fromApiFormat } from '../helper/ApiFormatter';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

import { getClaimantRepAboutYouDetails } from './helpers/ClaimantRepAnswersHelper';
import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('ClaimantRepAboutYouController');

export default class ClaimantRepAboutYouController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const caseId = req.params.caseId;

    try {
      const caseData = await getCaseApi(req.session.user?.accessToken).getUserCase(caseId);
      req.session.userCase = fromApiFormat(caseData.data);
    } catch (error) {
      logger.error(`Error loading case ${caseId}: ${error.message}`);
      return res.redirect(PageUrls.CLAIMANT_APPLICATIONS);
    }

    const userCase = req.session.userCase;
    const languageParam = getLanguageParam(req.url);

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CLAIMANT_REP_ABOUT_YOU, { returnObjects: true }),
    };

    res.render(TranslationKeys.CLAIMANT_REP_ABOUT_YOU, {
      ...translations,
      PageUrls,
      languageParam,
      userCase,
      backLinkUrl: PageUrls.CLAIMANT_REP_HUB.replace(':caseId', caseId) + languageParam,
      aboutYouRows: getClaimantRepAboutYouDetails(userCase, req.session.user?.email, translations, languageParam),
      contactTribunalUrl: PageUrls.CONTACT_THE_TRIBUNAL + languageParam,
    });
  };
}

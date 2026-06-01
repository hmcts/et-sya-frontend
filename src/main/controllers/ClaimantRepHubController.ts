import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { AnyRecord } from '../definitions/util-types';
import { fromApiFormat } from '../helper/ApiFormatter';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

const logger = getLogger('ClaimantRepHubController');

export default class ClaimantRepHubController {
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
    const translations: AnyRecord = {
      ...req.t(TranslationKeys.CLAIMANT_REP_HUB, { returnObjects: true }),
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    };

    res.render(TranslationKeys.CLAIMANT_REP_HUB, {
      ...translations,
      userCase,
      PageUrls,
    });
  };
}

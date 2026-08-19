import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, TranslationKeys } from '../definitions/constants';
import { AnyRecord } from '../definitions/util-types';
import { fromApiFormat } from '../helper/ApiFormatter';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

import { getClaimantContactDetails } from './helpers/ClaimantContactDetailsHelper';

const logger = getLogger('ClaimantContactDetailsController');

export default class ClaimantContactDetailsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const caseId = req.params.caseId;

    // Access is enforced by the API: getUserCase only returns cases the logged-in user is assigned to
    // (mirrors the claimant rep hub). Unauthorised or missing cases fall through to /not-found.
    try {
      const caseData = await getCaseApi(req.session.user?.accessToken).getUserCase(caseId);
      req.session.userCase = fromApiFormat(caseData.data);
    } catch (error) {
      logger.error(`Error loading case ${caseId}: ${error.message}`);
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CLAIMANT_CONTACT_DETAILS, { returnObjects: true }),
    };

    res.render(TranslationKeys.CLAIMANT_CONTACT_DETAILS, {
      ...translations,
      hideContactUs: true,
      contactDetails: getClaimantContactDetails(req.session.userCase, translations),
    });
  };
}

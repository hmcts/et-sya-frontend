import { AppRequest } from '../../definitions/appRequest';
import { PageUrls } from '../../definitions/constants';
import { getCaseApi } from '../../services/CaseService';
import NumberUtils from '../../utils/NumberUtils';

import { getLanguageParam, returnValidUrl } from './RouterHelpers';

export const removeClaimantRepresentative = async (req: AppRequest): Promise<string> => {
  await getCaseApi(req.session.user?.accessToken)?.removeClaimantRepresentative(req);
  const caseId = req.session.userCase?.id;
  if (NumberUtils.isNumericValue(caseId)) {
    return returnValidUrl(`/citizen-hub/${caseId}${getLanguageParam(req.url)}`);
  }
  return PageUrls.CLAIMANT_APPLICATIONS;
};

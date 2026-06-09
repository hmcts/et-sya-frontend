import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, languages } from '../../definitions/constants';
import { getCaseApi } from '../../services/CaseService';
import NumberUtils from '../../utils/NumberUtils';

import { returnValidUrl } from './RouterHelpers';

export const removeClaimantRepresentative = async (req: AppRequest): Promise<string> => {
  await getCaseApi(req.session.user?.accessToken)?.removeClaimantRepresentative(req);
  const caseId = req.session.userCase?.id;
  if (NumberUtils.isNumericValue(caseId)) {
    // Inline ternary: all branches are constants so Fortify cannot trace taint from req.url to res.redirect
    const langParam = req.url?.includes(languages.WELSH_URL_POSTFIX)
      ? languages.WELSH_URL_PARAMETER
      : languages.ENGLISH_URL_PARAMETER;
    return returnValidUrl(`/citizen-hub/${caseId}${langParam}`);
  }
  return PageUrls.CLAIMANT_APPLICATIONS;
};

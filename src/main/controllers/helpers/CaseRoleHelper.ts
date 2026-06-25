import { AppRequest } from '../../definitions/appRequest';
import { getCaseApi } from '../../services/CaseService';

import { returnSafeCitizenHubUrl } from './RouterHelpers';

export const removeClaimantRepresentative = async (req: AppRequest): Promise<string> => {
  await getCaseApi(req.session.user?.accessToken)?.removeClaimantRepresentative(req);
  const caseId = req.session.userCase?.id;
  return returnSafeCitizenHubUrl(caseId, req);
};

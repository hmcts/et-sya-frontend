import { AppRequest } from '../../definitions/appRequest';
import { getCaseApi } from '../../services/CaseService';

import { getLanguageParam } from './RouterHelpers';

export const removeClaimantRepresentative = async (req: AppRequest): Promise<string> => {
  await getCaseApi(req.session.user?.accessToken)?.removeClaimantRepresentative(req);
  return '/citizen-hub/' + req.session.userCase.id + getLanguageParam(req.url);
};

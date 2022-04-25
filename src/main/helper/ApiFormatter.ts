import { CaseApiBody } from '../definitions/api/caseApiBody';
import { CaseApiDataResponse } from '../definitions/api/caseApiResponse';
import { UserDetails } from '../definitions/appRequest';
import { CaseDataCacheKey, CaseWithId } from '../definitions/case';
import { CcdDataModel } from '../definitions/constants';

export function toApiFormat(userDataMap: Map<CaseDataCacheKey, string>, userDetails: UserDetails): CaseApiBody {
  return {
    caseType: userDataMap.get(CaseDataCacheKey.CASE_TYPE),
    claimantRespresentedQuestion: userDataMap.get(CaseDataCacheKey.CLAIMANT_REPRESENTED),
    caseSource: CcdDataModel.CASE_SOURCE,
    claimantIndType: {
      claimant_first_names: userDetails.givenName,
      claimant_last_name: userDetails.familyName,
    },
    claimantType: {
      claimant_email_address: userDetails.email,
    },
  };
}

export function fromApiFormat(fromApiCaseData: CaseApiDataResponse): CaseWithId {
  return {
    id: fromApiCaseData.id,
    state: fromApiCaseData.state,
    claimantRepresentedQuestion: fromApiCaseData.case_data?.claimantRepresentedQuestion,
    caseType: fromApiCaseData.case_data?.caseType,
  };
}

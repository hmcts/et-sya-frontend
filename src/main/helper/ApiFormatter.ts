import { CaseApiBody } from '../definitions/api/caseApiBody';
import { CaseApiDataResponse } from '../definitions/api/caseApiResponse';
import { UserDetails } from '../definitions/appRequest';
import { CaseDataCacheKey, CaseDate, CaseWithId } from '../definitions/case';
import { CcdDataModel } from '../definitions/constants';

export function toApiFormatPreLogin(userDataMap: Map<CaseDataCacheKey, string>, userDetails: UserDetails): CaseApiBody {
  return {
    caseType: userDataMap.get(CaseDataCacheKey.CASE_TYPE),
    claimantRepresentedQuestion: userDataMap.get(CaseDataCacheKey.CLAIMANT_REPRESENTED),
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

export function toApiFormat(caseItem: CaseWithId): CaseApiBody {
  return {
    caseType: caseItem.caseType,
    claimantRepresentedQuestion: caseItem.claimantRepresentedQuestion,
    caseSource: CcdDataModel.CASE_SOURCE,
    claimantIndType: {
      claimant_date_of_birth: formatDoB(caseItem.dobDate),
    },
  };
}

function formatDoB(dobDate: CaseDate) {
  return `${dobDate.year}-${dobDate.month}-${dobDate.day}`;
}

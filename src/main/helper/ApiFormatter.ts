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
    firstName: fromApiCaseData.case_data?.claimantIndType?.claimant_first_names,
    lastName: fromApiCaseData.case_data?.claimantIndType?.claimant_last_name,
    email: fromApiCaseData.case_data?.claimantType?.claimant_email_address,
    dobDate: formatDoBString(fromApiCaseData.case_data?.claimantIndType?.claimant_date_of_birth),
  };
}

export function toApiFormat(caseItem: CaseWithId): CaseApiBody {
  return {
    caseType: caseItem.caseType,
    claimantRepresentedQuestion: caseItem.claimantRepresentedQuestion,
    caseSource: CcdDataModel.CASE_SOURCE,
    claimantIndType: {
      claimant_first_names: caseItem.firstName,
      claimant_last_name: caseItem.lastName,
      claimant_date_of_birth: formatDoB(caseItem.dobDate),
    },
    claimantType: {
      claimant_email_address: caseItem.email,
    },
  };
}

function formatDoB(dobDate: CaseDate) {
  return `${dobDate.year}-${dobDate.month}-${dobDate.day}`;
}

function formatDoBString(dobDate: string): CaseDate {
  if (dobDate) {
    const year = dobDate.substring(0, 4);
    const month = dobDate.substring(5, 7);
    const day = dobDate.substring(8);

    return {
      year,
      month,
      day,
    };
  }
}

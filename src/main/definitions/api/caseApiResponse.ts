import { CaseType, CaseTypeId, YesOrNo } from '../case';
import { ClaimantCorrespondence } from '../complexTypes/claimantCorrespondence';
import { ClaimantIndividual } from '../complexTypes/claimantIndividual';
import { CaseState } from '../definition';

export interface CreateCaseResponse {
  data: CaseApiDataResponse;
}

export interface CaseApiDataResponse {
  id: string;
  jurisdiction?: string;
  state: CaseState;
  case_type_id?: CaseTypeId;
  created_date?: Date;
  last_modified?: Date;
  locked_by_user_id?: boolean | null;
  security_level?: string | null;
  case_data?: CaseData;
  security_classification?: string;
  callback_response_status?: string | null;
}
export interface CaseData {
  caseType?: CaseType;
  caseSource?: string;
  claimantRepresentedQuestion?: YesOrNo;
  claimantIndType?: ClaimantIndividual;
  claimantType?: ClaimantCorrespondence;
}

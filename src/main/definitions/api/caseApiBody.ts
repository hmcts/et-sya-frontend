import { ClaimantIndividual } from '../complexTypes/claimantIndividual';
import { ClaimantOtherType } from '../complexTypes/claimantOtherType';

interface CaseDataApiBody {
  caseType: string;
  claimantRepresentedQuestion: string;
  caseSource: string;
  claimantIndType?: ClaimantIndividual;
  claimantType?: { claimant_email_address: string };
  claimantOtherType?: ClaimantOtherType;
}

export interface CreateCaseBody {
  post_code: string;
  case_data: CaseDataApiBody;
}

export interface UpdateCaseBody {
  case_id: string;
  case_type_id: string;
  case_data: CaseDataApiBody;
}

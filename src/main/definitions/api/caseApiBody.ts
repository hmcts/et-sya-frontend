import { ClaimantContactPreference } from '../complexTypes/claimantContactPreference';
import { ClaimantEmploymentDetails } from '../complexTypes/claimantEmploymentDetails';
import { ClaimantHearingPreference } from '../complexTypes/claimantHearingPreference';
import { ClaimantIndividual } from '../complexTypes/claimantIndividual';
import { TaskListCheckType } from '../complexTypes/taskListCheckType';

interface CaseDataApiBody {
  caseType: string;
  claimantRepresentedQuestion: string;
  caseSource: string;
  claimantIndType?: ClaimantIndividual;
  claimantType?: { claimant_email_address: string };
  claimantHearingPreference?: ClaimantHearingPreference;
  claimantContactPreference?: ClaimantContactPreference;
  claimantTaskListChecks?: TaskListCheckType;
  claimantOtherType?: ClaimantEmploymentDetails;
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

import { ClaimantIndividual } from '../../definitions/complexTypes/claimantIndividual';
import { ClaimantHearingPreference } from '../complexTypes/claimantHearingPreference';
import { TaskListCheckType } from '../complexTypes/taskListCheckType';

interface CaseDataApiBody {
  caseType: string;
  claimantRepresentedQuestion: string;
  caseSource: string;
  claimantIndType?: ClaimantIndividual;
  claimantType?: { claimant_email_address: string };
  claimantHearingPreference?: ClaimantHearingPreference;
  claimantTaskListChecks?: TaskListCheckType;
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

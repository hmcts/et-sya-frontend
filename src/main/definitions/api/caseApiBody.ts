import { ClaimantCorrespondence } from '../complexTypes/claimantCorrespondence';
import { ClaimantEmploymentDetails } from '../complexTypes/claimantEmploymentDetails';
import { ClaimantHearingPreference } from '../complexTypes/claimantHearingPreference';
import { ClaimantIndividual } from '../complexTypes/claimantIndividual';
import { TaskListCheckType } from '../complexTypes/taskListCheckType';

interface CaseDataApiBody {
  caseType: string;
  claimantRepresentedQuestion: string;
  caseSource: string;
  claimantIndType?: ClaimantIndividual;
  claimantType?: ClaimantCorrespondence;
  claimantHearingPreference?: ClaimantHearingPreference;
  claimantTaskListChecks?: TaskListCheckType;
  claimantOtherType?: ClaimantEmploymentDetails;
  personalDetailsCheck?: TaskListCheckType;
  employmentAndRespondentCheck?: TaskListCheckType;
  claimDetailsCheck?: TaskListCheckType;
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

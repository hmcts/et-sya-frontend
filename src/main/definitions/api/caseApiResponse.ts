import { DocumentElement } from '../../helper/ApiFormatter';
import { CaseType, CaseTypeId, YesOrNo } from '../case';
import { ClaimantCorrespondence } from '../complexTypes/claimantCorrespondence';
import { ClaimantEmploymentDetails } from '../complexTypes/claimantEmploymentDetails';
import { ClaimantHearingPreference } from '../complexTypes/claimantHearingPreference';
import { ClaimantIndividual } from '../complexTypes/claimantIndividual';
import { NewEmploymentDetails } from '../complexTypes/newEmploymentDetails';
import { RespondentType } from '../complexTypes/respondent';
import { TaskListCheckType } from '../complexTypes/taskListCheckType';
import { CaseState } from '../definition';
import { HubLinks } from '../hub';

export interface CreateCaseResponse {
  data: CaseApiDataResponse;
}

export interface CaseApiDataResponse {
  id: string;
  jurisdiction?: string;
  state: CaseState;
  case_type_id?: CaseTypeId;
  created_date?: string;
  last_modified?: string;
  locked_by_user_id?: boolean | null;
  security_level?: string | null;
  case_data?: CaseData;
  security_classification?: string;
  callback_response_status?: string | null;
  servingDocumentCollection?: DocumentElement[];
}

export interface CaseData {
  ethosCaseReference?: string;
  caseType?: CaseType;
  typeOfClaim?: string[];
  caseSource?: string;
  claimantRepresentedQuestion?: YesOrNo;
  claimantIndType?: ClaimantIndividual;
  claimantType?: ClaimantCorrespondence;
  claimantOtherType?: ClaimantEmploymentDetails;
  newEmploymentType?: NewEmploymentDetails;
  claimantHearingPreference?: ClaimantHearingPreference;
  claimantTaskListChecks?: TaskListCheckType;
  respondentCollection?: RespondentApiModel[];
  et3IsThereAnEt3Response?: YesOrNo;
  hubLinks?: HubLinks;
  servingDocumentCollection?: DocumentElement[];
}

export interface RespondentApiModel {
  value?: RespondentType;
  id?: string;
}

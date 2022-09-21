import { CaseType, CaseTypeId, DocumentCollection, YesOrNo } from '../case';
import { ClaimantCorrespondence } from '../complexTypes/claimantCorrespondence';
import { ClaimantEmploymentDetails } from '../complexTypes/claimantEmploymentDetails';
import { ClaimantHearingPreference } from '../complexTypes/claimantHearingPreference';
import { ClaimantIndividual } from '../complexTypes/claimantIndividual';
import { ClaimantRequests } from '../complexTypes/claimantRequests';
import { NewEmploymentDetails } from '../complexTypes/newEmploymentDetails';
import { RespondentType } from '../complexTypes/respondent';
import { TaskListCheckType } from '../complexTypes/taskListCheckType';
import { WorkAddressDetails } from '../complexTypes/workAddressDetails';
import { CaseState } from '../definition';
import { HubLinksStatuses } from '../hub';

export interface CreateCaseResponse {
  data: CaseApiDataResponse;
}

export interface CaseApiDataResponse {
  id: string;
  created_date: string;
  last_modified: string;
  jurisdiction?: string;
  state: CaseState;
  case_type_id?: CaseTypeId;
  locked_by_user_id?: boolean | null;
  security_level?: string | null;
  case_data?: CaseData;
  security_classification?: string;
  callback_response_status?: string | null;
}

export interface CaseData {
  ethosCaseReference?: string;
  caseType?: CaseType;
  ClaimantPcqId?: string;
  typeOfClaim?: string[];
  caseSource?: string;
  claimantRepresentedQuestion?: YesOrNo;
  claimantIndType?: ClaimantIndividual;
  claimantType?: ClaimantCorrespondence;
  claimantOtherType?: ClaimantEmploymentDetails;
  newEmploymentType?: NewEmploymentDetails;
  claimantRequests?: ClaimantRequests;
  claimantHearingPreference?: ClaimantHearingPreference;
  claimantTaskListChecks?: TaskListCheckType;
  respondentCollection?: RespondentApiModel[];
  claimantWorkAddressQuestion?: YesOrNo;
  claimantWorkAddress?: WorkAddressDetails;
  et3IsThereAnEt3Response?: YesOrNo;
  hubLinksStatuses?: HubLinksStatuses;
  managingOffice?: string;
  tribunalCorrespondenceEmail?: string;
  tribunalCorrespondenceTelephone?: string;
  documentCollection?: DocumentCollection[];
}

export interface RespondentApiModel {
  value?: RespondentType;
  id?: string;
}

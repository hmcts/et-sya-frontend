import { CaseType, CaseTypeId, YesOrNo } from '../case';
import { SendNotificationTypeItem } from '../complexTypes/SendNotificationTypeItem';
import { ClaimantCorrespondence } from '../complexTypes/claimantCorrespondence';
import { ClaimantEmploymentDetails } from '../complexTypes/claimantEmploymentDetails';
import { ClaimantHearingPreference } from '../complexTypes/claimantHearingPreference';
import { ClaimantIndividual } from '../complexTypes/claimantIndividual';
import { ClaimantRequests } from '../complexTypes/claimantRequests';
import { GenericTseApplicationTypeItem } from '../complexTypes/genericTseApplicationTypeItem';
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
  servingDocumentCollection?: DocumentApiModel[];
  documentCollection?: DocumentApiModel[];
}

export interface CaseData {
  ethosCaseReference?: string;
  feeGroupReference?: string;
  caseType?: CaseType;
  ClaimantPcqId?: string;
  typesOfClaim?: string[];
  caseSource?: string;
  claimantRepresentedQuestion?: YesOrNo;
  claimant_TypeOfClaimant?: string;
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
  et3ResponseReceived?: boolean;
  receiptDate?: string;
  hubLinksStatuses?: HubLinksStatuses;
  managingOffice?: string;
  tribunalCorrespondenceEmail?: string;
  tribunalCorrespondenceTelephone?: string;
  servingDocumentCollection?: DocumentApiModel[];
  documentCollection?: DocumentApiModel[];
  et3NotificationDocCollection?: DocumentApiModel[];
  et3ResponseContestClaimDocument?: DocumentApiModel[];
  claimServedDate?: string;
  genericTseApplicationCollection?: GenericTseApplicationTypeItem[];
  sendNotificationCollection?: SendNotificationTypeItem[];
}

export interface RespondentApiModel {
  value?: RespondentType;
  id?: string;
}

export interface DocumentApiModel {
  id: string;
  value: {
    typeOfDocument?: string;
    shortDescription?: string;
    uploadedDocument: {
      document_url: string;
      document_filename: string;
      document_binary_url: string;
    };
  };
}

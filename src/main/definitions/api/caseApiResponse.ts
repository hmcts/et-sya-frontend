import { CaseType, CaseTypeId, YesOrNo } from '../case';
import { ClaimantCorrespondence } from '../complexTypes/claimantCorrespondence';
import { ClaimantEmploymentDetails } from '../complexTypes/claimantEmploymentDetails';
import { ClaimantHearingPreference } from '../complexTypes/claimantHearingPreference';
import { ClaimantIndividual } from '../complexTypes/claimantIndividual';
import { ClaimantRequests } from '../complexTypes/claimantRequests';
import { GenericTseApplicationTypeItem } from '../complexTypes/genericTseApplicationTypeItem';
import { NewEmploymentDetails } from '../complexTypes/newEmploymentDetails';
import { RespondentType } from '../complexTypes/respondent';
import { SendNotificationTypeItem } from '../complexTypes/sendNotificationTypeItem';
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
  hearingCollection?: HearingModel[];
}

export interface HearingModel {
  id: string;
  value: {
    Est_Hearing?: {
      fromDays: string;
      fromHours: string;
      fromMinues: string;
    };
    Hearing_stage?: string;
    hearingFormat: string[];
    Hearing_type?: string;
    hearingNumber: string;
    hearingSitAlone: string;
    judicialMediation: string;
    hearingEstLengthNum: number;
    hearingPublicPrivate: string;
    Hearing_notes?: string;
    Hearing_date_start?: Date;
    Hearing_judge_name?: string;
    Hearing_venue?: {
      value: HearingVenueItem;
      list_items: HearingVenueItem[];
      selectedCode: string;
      selectedLabel: string;
    };
    hearingDateCollection: {
      id: string;
      value: {
        listedDate: Date;
        Hearing_status: string;
        hearingVenueDay?: {
          value: {
            code: string;
            label: string;
          };
          list_items: {
            code: string;
            label: string;
          }[];
          selectedCode: string;
          selectedLabel: string;
        };
        hearingTimingStart?: Date;
        hearingTimingFinish?: Date;
      };
    }[];
  };
}

export interface HearingVenueItem {
  code: string;
  label: string;
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

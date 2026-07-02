export type CaseTransferType = 'ECM' | 'CROSS_COUNTRY';

export interface CaseTransferInfoResponse {
  transferred: boolean;
  transferType: CaseTransferType;
  caseState?: string;
  originalCaseId?: string;
  originalEthosCaseReference?: string;
  newEthosCaseReference?: string;
  newCaseId?: string;
  destinationOffice?: string;
  reasonForCT?: string;
  transferComplete: boolean;
  claimantFirstName?: string;
  claimantLastName?: string;
  respondentName?: string;
}

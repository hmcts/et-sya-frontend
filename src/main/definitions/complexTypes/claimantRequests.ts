import { Document, YesOrNo } from '../../definitions/case';
import { ClaimTypeDiscrimination, ClaimTypePay, TellUsWhatYouWant } from '../../definitions/definition';

export interface ClaimantRequests {
  discrimination_claims?: ClaimTypeDiscrimination[];
  pay_claims?: ClaimTypePay[];
  claim_description?: string;
  claim_outcome?: TellUsWhatYouWant[];
  claimant_compensation_text?: string;
  claimant_compensation_amount?: number;
  claimant_tribunal_recommendation?: string;
  whistleblowing?: YesOrNo;
  whistleblowing_authority?: string;
  claim_description_document?: Document;
  document_filename?: string;
}

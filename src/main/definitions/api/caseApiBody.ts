import { ClaimantIndividual } from '../../definitions/complexTypes/claimantIndividual';

export interface CaseApiBody {
  caseType: string;
  claimantRepresentedQuestion: string;
  caseSource: string;
  claimantIndType?: ClaimantIndividual;
  claimantType?: { claimant_email_address: string };
}

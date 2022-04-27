export interface CaseApiBody {
  caseType: string;
  claimantRepresentedQuestion: string;
  caseSource: string;
  claimantIndType: { claimant_first_names: string; claimant_last_name: string };
  claimantType: { claimant_email_address: string };
}

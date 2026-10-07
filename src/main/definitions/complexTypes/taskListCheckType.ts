import { YesOrNo } from '../case';

export interface TaskListCheckType {
  personalDetailsCheck?: YesOrNo;
  groupClaimsCheck?: YesOrNo;
  employmentAndRespondentCheck?: YesOrNo;
  claimDetailsCheck?: YesOrNo;
  representativeDetailsCheck?: YesOrNo;
  representedClaimantDetailsCheck?: YesOrNo;
  representedClaimantNameProvided?: YesOrNo;
  representedClaimantEmailProvided?: YesOrNo;
}

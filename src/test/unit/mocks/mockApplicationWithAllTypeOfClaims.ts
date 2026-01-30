import { ApplicationTableRecord, CaseState } from '../../../main/definitions/definition';

export const mockApplicationWithAllTypeOfClaims: ApplicationTableRecord = {
  userCase: {
    id: '1234567',
    state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
    typeOfClaim: [
      'breachOfContract',
      'discrimination',
      'payRelated',
      'unfairDismissal',
      'whistleBlowing',
      'otherTypesOfClaims',
    ],
    createdDate: 'September 1, 2022',
    lastModified: 'September 1, 2022',
  },
  respondents: 'undefined',
  completionStatus: '0 of 4 tasks completed',
  url: '/claimant-application/123456',
  deleteDraftUrl: '/claimant-applications',
};

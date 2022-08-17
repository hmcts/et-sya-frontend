import { YesOrNo } from '../../../main/definitions/case';
import { Urls } from '../../../main/definitions/constants';
import { ApplicationTableRecord, CaseState } from '../../../main/definitions/definition';

export const mockApplications: ApplicationTableRecord[] = [
  {
    userCase: {
      id: '12345',
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      personalDetailsCheck: YesOrNo.YES,
      employmentAndRespondentCheck: YesOrNo.YES,
      claimDetailsCheck: YesOrNo.YES,
      respondents: [
        {
          respondentName: 'Globo Corp',
        },
        {
          respondentName: 'Mega Globo Corp',
        },
      ],
    },
    respondents: 'Globo Corp<br />Mega Globo Corp',
    completionStatus: '4 of 4 tasks completed',
    url: '/claimant-application/12345',
  },
  {
    userCase: {
      id: '1234567',
      state: CaseState.SUBMITTED,
      respondents: [
        {
          respondentName: 'Globo Corp',
        },
      ],
    },
    respondents: 'Globo Corp',
    completionStatus: '0 of 4 tasks completed',
    url: Urls.DOWNLOAD_CLAIM,
  },
];

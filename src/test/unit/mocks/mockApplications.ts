import { YesOrNo } from '../../../main/definitions/case';
import { ApplicationTableRecord, CaseState } from '../../../main/definitions/definition';

export const mockApplications: ApplicationTableRecord[] = [
  {
    userCase: {
      id: '12345',
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      personalDetailsCheck: YesOrNo.YES,
      employmentAndRespondentCheck: YesOrNo.YES,
      claimDetailsCheck: YesOrNo.YES,
      typeOfClaim: ['discrimination'],
      createdDate: 'September 1, 2022',
      lastModified: 'September 1, 2022',
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
      id: '123456',
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      typeOfClaim: ['discrimination'],
      createdDate: 'September 1, 2022',
      lastModified: 'September 1, 2022',
    },
    respondents: 'undefined',
    completionStatus: '0 of 4 tasks completed',
    url: '/claimant-application/123456',
  },
  {
    userCase: {
      id: '1234567',
      state: CaseState.SUBMITTED,
      typeOfClaim: ['discrimination'],
      createdDate: 'September 1, 2022',
      lastModified: 'September 1, 2022',
      respondents: [
        {
          respondentName: 'Globo Corp',
        },
      ],
      et1SubmittedForm: {
        document_binary_url: 'http://dm-store:8080/documents/3aa7dfc1-378b-4fa8-9a17-89126fae5673/binary',
        document_filename: 'ET1_CASE_DOCUMENT_Sunday_Ayeni.pdf',
        document_url: 'http://dm-store:8080/documents/3aa7dfc1-378b-4fa8-9a17-89126fae5673',
      },
    },
    respondents: 'Globo Corp',
    completionStatus: '0 of 4 tasks completed',
    url: 'http://dm-store:8080/documents/3aa7dfc1-378b-4fa8-9a17-89126fae5673',
  },
];

import { YesOrNo } from '../../../main/definitions/case';
import { GenericTseApplicationTypeItem } from '../../../main/definitions/complexTypes/genericTseApplicationTypeItem';
import { ApplicationTableRecord, CaseState, RespondentApplicationDetails } from '../../../main/definitions/definition';

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
      typeOfClaimString: 'discrimination',
    },
    respondents: 'Globo Corp<br />Mega Globo Corp',
    completionStatus: '4 of 4 tasks completed',
    url: '/claimant-application/12345?lng=en',
  },
  {
    userCase: {
      id: '123456',
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      typeOfClaim: ['discrimination'],
      createdDate: 'September 1, 2022',
      lastModified: 'September 1, 2022',
      typeOfClaimString: 'discrimination',
    },
    respondents: 'undefined',
    completionStatus: '0 of 4 tasks completed',
    url: '/claimant-application/123456?lng=en',
  },
  {
    userCase: {
      id: '1234567',
      state: CaseState.SUBMITTED,
      typeOfClaim: ['discrimination'],
      createdDate: 'September 1, 2022',
      lastModified: 'September 1, 2022',
      ethosCaseReference: '654321/2022',
      respondents: [
        {
          respondentName: 'Globo Corp',
        },
      ],
      et1SubmittedForm: {
        id: '3aa7dfc1-378b-4fa8-9a17-89126fae5673',
        description: 'Test',
        type: 'ET1',
      },
      typeOfClaimString: 'discrimination',
    },
    respondents: 'Globo Corp',
    completionStatus: '0 of 4 tasks completed',
    url: '/citizen-hub/1234567?lng=en',
  },
];

export const mockRespondentApplications: RespondentApplicationDetails[] = [
  {
    respondentApplicationHeader: 'The respondent has applied to amend response',
    respondToRespondentAppRedirectUrl: '/respondent-application-details/1?lng=en',
    copyToOtherPartyYesOrNo: 'Yes',
    applicationType: 'A',
    number: '1',
  },
  {
    respondentApplicationHeader: 'The respondent has applied to change personal details',
    respondToRespondentAppRedirectUrl: '/respondent-application-details/2?lng=en',
    copyToOtherPartyYesOrNo: 'Yes',
    applicationType: 'B',
    number: '2',
  },
  {
    respondentApplicationHeader: 'The respondent has applied to tell the tribunal the claimant has not complied',
    respondToRespondentAppRedirectUrl: '/respondent-application-details/3?lng=en',
    copyToOtherPartyYesOrNo: 'No',
    applicationType: 'A',
    number: '3',
  },
  {
    respondentApplicationHeader: 'The respondent has applied to consider a decision afresh',
    respondToRespondentAppRedirectUrl: '/respondent-application-details/4?lng=en',
    copyToOtherPartyYesOrNo: 'No',
    applicationType: 'B',
    number: '4',
  },
];

export const mockRespondentApplicationDetails: GenericTseApplicationTypeItem[] = [
  {
    value: {
      date: '7 March 2023',
      type: 'Amend response',
      number: '1',
      details: 'Amend response text',
      applicant: 'Respondent',
      copyToOtherPartyYesOrNo: YesOrNo.YES,
    },
    linkValue: 'Amend response',
  },
  {
    value: {
      date: '13 March 2023',
      type: 'Change personal details',
      number: '2',
      details: 'Change personal details text',
      applicant: 'Respondent',
      copyToOtherPartyYesOrNo: YesOrNo.YES,
    },
    linkValue: 'Change personal details',
  },
];

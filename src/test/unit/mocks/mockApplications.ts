import { YesOrNo } from '../../../main/definitions/case';
import {
  GenericTseApplicationType,
  GenericTseApplicationTypeItem,
} from '../../../main/definitions/complexTypes/genericTseApplicationTypeItem';
import { ApplicationTableRecord, CaseState, RespondentApplicationDetails } from '../../../main/definitions/definition';
import { HubLinkStatus } from '../../../main/definitions/hub';
import { clone } from '../test-helpers/clone';

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
    deleteDraftUrl: '/claimant-applications',
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
    deleteDraftUrl: '/claimant-applications',
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
    deleteDraftUrl: '/claimant-applications',
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

export const mockSimpleRespApp: GenericTseApplicationType = {
  number: '1',
  type: 'Amend response',
  applicant: 'Respondent',
  copyToOtherPartyYesOrNo: YesOrNo.YES,
  applicationState: 'notStartedYet',
  dueDate: '14 March 2023',
};

export const mockSimpleRespAppTypeItem: GenericTseApplicationTypeItem = {
  id: '1',
  value: mockSimpleRespApp,
};

export const mockSimpleViewedRespAppTypeItem: GenericTseApplicationTypeItem = {
  id: '1',
  value: { ...mockSimpleRespApp, applicationState: 'inProgress' },
};

export const mockRespAppWithRespRequstForInfo: GenericTseApplicationTypeItem = {
  id: '1',
  value: {
    date: '12 June 2023',
    type: 'Change personal details',
    number: '6',
    status: 'Open',
    details: 'look ma, flexUI populated',
    dueDate: '19 June 2023',
    applicant: 'Respondent',
    responsesCount: '1',
    applicationState: 'updated',
    respondCollection: [
      {
        id: '507ada6b-62f9-4d98-8498-5358a56e5ade',
        value: {
          date: '12 June 2023',
          from: 'Admin',
          addDocument: [
            {
              id: '97fed2cc-19c0-4bcc-b599-cc10c03a488a',
              value: {
                uploadedDocument: {
                  document_url: 'http://dm-store:8080/documents/bd9a7bea-e358-4025-8ccb-3f02ecd0839a',
                  document_filename: '1. Welsh Case overview.docx',
                  document_binary_url: 'http://dm-store:8080/documents/bd9a7bea-e358-4025-8ccb-3f02ecd0839a/binary',
                },
              },
            },
          ],
          requestMadeBy: 'Legal officer',
          isCmoOrRequest: 'Request',
          madeByFullName: 'LO',
          selectPartyNotify: 'Both parties',
          isResponseRequired: 'Yes',
          selectPartyRespond: 'Respondent',
        },
      },
    ],
    copyToOtherPartyYesOrNo: YesOrNo.YES,
  },
  linkValue: 'change personal details',
  redirectUrl: '/respondent-application-details/d8540a12-80f9-48f4-800b-cea1210a5a13?lng=en',
  displayStatus: 'Updated',
  statusColor: '--blue',
};

const requestForInfoClone = clone(mockRespAppWithRespRequstForInfo);
requestForInfoClone.value.claimantResponseRequired = 'Yes';
requestForInfoClone.value.applicationState = 'notStartedYet';
export const mockRespAppWithRespRequstForClaimantInfo = requestForInfoClone;

export const mockRespAppWithRespRequstForInfoAndReply: GenericTseApplicationTypeItem = {
  id: '1',
  value: {
    date: '19 June 2023',
    type: 'Change personal details',
    number: '11',
    status: 'Open',
    details: 'look ma, flexUI populated',
    dueDate: '26 June 2023',
    applicant: 'Respondent',
    responsesCount: '2',
    applicationState: 'updated',
    respondCollection: [
      {
        id: '0173ccd0-e20c-41bf-9a1c-37e97c728efc',
        value: {
          date: '19 June 2023',
          from: 'Admin',
          addDocument: [
            {
              id: '32dc537e-2789-454b-bb17-43e186c6c4e2',
              value: {
                uploadedDocument: {
                  document_url: 'http://dm-store:8080/documents/4813c796-992a-4c27-ba11-ec35c01d4509',
                  document_filename: 'et1_a_b.pdf',
                  document_binary_url: 'http://dm-store:8080/documents/4813c796-992a-4c27-ba11-ec35c01d4509/binary',
                },
              },
            },
          ],
          requestMadeBy: 'Case worker',
          isCmoOrRequest: 'Request',
          madeByFullName: 'case worker',
          selectPartyNotify: 'Respondent only',
          isResponseRequired: 'Yes',
          selectPartyRespond: 'Respondent',
        },
      },
      {
        id: '943b0b04-fed0-4e54-9859-6295cfac64bd',
        value: {
          date: '19 June 2023',
          from: 'Respondent',
          response: 'asd',
          copyToOtherParty: 'Yes',
          hasSupportingMaterial: YesOrNo.NO,
        },
      },
    ],
    copyToOtherPartyYesOrNo: YesOrNo.YES,
  },
  linkValue: 'change personal details',
  redirectUrl: '/respondent-application-details/5d3a4c68-42dc-4b77-9474-6f6043dc020f?lng=en',
  displayStatus: 'Updated',
  statusColor: '--blue',
};

export const mockRespAppWithClaimantResponse: GenericTseApplicationType = {
  date: '2 June 2023',
  type: 'Amend response',
  number: '2',
  status: 'Open',
  details: 'asd',
  dueDate: '9 June 2023',
  applicant: 'Respondent',
  responsesCount: '1',
  applicationState: 'waitingForTheTribunal',
  respondCollection: [
    {
      id: 'ac55bb6d-ce54-4090-aa3e-1073b3bb5d82',
      value: {
        date: '2 June 2023',
        from: 'Claimant',
        response: 'sdfsdf',
        copyToOtherParty: 'Yes',
        hasSupportingMaterial: YesOrNo.NO,
      },
    },
  ],
  copyToOtherPartyYesOrNo: YesOrNo.YES,
};

export const mockRespAppWithDecisionNotViewed: GenericTseApplicationType = {
  date: '5 June 2023',
  type: 'Amend response',
  number: '1',
  status: 'Open',
  details: '1',
  dueDate: '12 June 2023',
  applicant: 'Respondent',
  adminDecision: [
    {
      id: '416799df-f1fd-4b21-ac24-0e3dbb09b508',
      value: {
        date: '5 June 2023',
        decision: 'Granted',
        decisionMadeBy: 'Legal officer',
        typeOfDecision: 'Judgment',
        selectPartyNotify: 'Both parties',
        decisionMadeByFullName: '1',
        enterNotificationTitle: '1',
      },
    },
  ],
  responsesCount: '0',
  applicationState: 'notViewedYet',
  copyToOtherPartyYesOrNo: YesOrNo.YES,
};

const decisionClone = clone(mockRespAppWithDecisionNotViewed);
decisionClone.applicationState = HubLinkStatus.VIEWED;
export const mockRespAppWithDecisionViewed = decisionClone;

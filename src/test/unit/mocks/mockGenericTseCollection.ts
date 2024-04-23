import { YesOrNo } from '../../../main/definitions/case';
import { GenericTseApplicationTypeItem } from '../../../main/definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant, Parties } from '../../../main/definitions/constants';
import { HubLinkStatus } from '../../../main/definitions/hub';

import {
  applicationUploadedDoc,
  decisionUploadedDoc1,
  decisionUploadedDoc2,
  responseUploadedDoc,
} from './mockUserCaseWithDecisionsAndJudgments';

export const mockGenericTseCollection: GenericTseApplicationTypeItem[] = [
  {
    id: '1',
    value: {
      applicant: Applicant.RESPONDENT,
      date: '2022-05-05',
      type: 'Amend my claim',
      copyToOtherPartyYesOrNo: YesOrNo.YES,
      details: 'Test application details text',
      number: '1',
      status: 'notViewedYet',
      dueDate: '2022-05-12',
      applicationState: 'notViewedYet',
      documentUpload: applicationUploadedDoc,
      adminDecision: [
        {
          id: '1',
          value: {
            date: '2022-05-05',
            decision: 'Granted',
            decisionMadeBy: 'Judge',
            typeOfDecision: 'Judgment',
            selectPartyNotify: 'Both parties',
            decisionMadeByFullName: 'Mr Test Judge',
            responseRequiredDoc: [
              {
                id: '1',
                value: {
                  typeOfDocument: 'Decision document',
                  shortDescription: 'Decision document 1',
                  uploadedDocument: decisionUploadedDoc1,
                },
              },
              {
                id: '2',
                value: {
                  typeOfDocument: 'Decision document',
                  shortDescription: 'Decision document 2',
                  uploadedDocument: decisionUploadedDoc2,
                },
              },
            ],
            enterNotificationTitle: 'Test decision title',
          },
        },
      ],
      claimantResponseRequired: YesOrNo.YES,
      respondCollection: [
        {
          id: '95263ac2-c8b3-40ed-9bf5-41fcd7dc2b13',
          value: {
            date: '11 May 2023',
            from: 'Claimant',
            response: 'Test claimant response text',
            copyToOtherParty: YesOrNo.YES,
            supportingMaterial: [
              {
                id: '4867c28c-845f-46ed-90a7-c3bc0ae73454',
                value: {
                  uploadedDocument: responseUploadedDoc,
                },
              },
            ],
            hasSupportingMaterial: YesOrNo.YES,
          },
        },
        {
          id: '95263ac2-c8b3-40ed-9bf5-41fcd7dc2b14',
          value: {
            date: '11 May 2023',
            from: 'Admin',
            enterResponseTitle: 'Test Admin text',
            isCmoOrRequest: 'Request',
            addDocument: [
              {
                id: '4867c28c-845f-46ed-90a7-c3bc0ae73454',
                value: {
                  uploadedDocument: responseUploadedDoc,
                },
              },
            ],
            requestMadeBy: 'Legal Officer',
            isResponseRequired: 'Yes',
            selectPartyNotify: 'Both parties',
            selectPartyRespond: 'Claimant',
          },
        },
      ],
    },
  },
  {
    id: '2',
    value: {
      applicant: Applicant.CLAIMANT,
      date: '2022-05-05',
      type: 'Amend my claim',
      copyToOtherPartyYesOrNo: YesOrNo.YES,
      details: 'Test application details text',
      number: '1',
      status: 'notViewedYet',
      dueDate: '2022-05-12',
      applicationState: 'notViewedYet',
      documentUpload: applicationUploadedDoc,
      adminDecision: [
        {
          id: '1',
          value: {
            date: '2022-05-05',
            decision: 'Granted',
            decisionMadeBy: 'Judge',
            typeOfDecision: 'Judgment',
            selectPartyNotify: 'Both parties',
            decisionMadeByFullName: 'Mr Test Judge',
            responseRequiredDoc: [
              {
                id: '1',
                value: {
                  typeOfDocument: 'Decision document',
                  shortDescription: 'Decision document 1',
                  uploadedDocument: decisionUploadedDoc1,
                },
              },
              {
                id: '2',
                value: {
                  typeOfDocument: 'Decision document',
                  shortDescription: 'Decision document 2',
                  uploadedDocument: decisionUploadedDoc2,
                },
              },
            ],
            enterNotificationTitle: 'Test decision title',
          },
        },
      ],
      claimantResponseRequired: YesOrNo.YES,
      respondCollection: [
        {
          id: '95263ac2-c8b3-40ed-9bf5-41fcd7dc2b15',
          value: {
            date: '11 May 2023',
            from: 'Respondent',
            response: 'Test respondent response text',
            copyToOtherParty: YesOrNo.YES,
            supportingMaterial: [
              {
                id: '4867c28c-845f-46ed-90a7-c3bc0ae73454',
                value: {
                  uploadedDocument: responseUploadedDoc,
                },
              },
            ],
            hasSupportingMaterial: YesOrNo.YES,
          },
        },
        {
          id: '95263ac2-c8b3-40ed-9bf5-41fcd7dc2b16',
          value: {
            date: '11 May 2023',
            from: 'Admin',
            enterResponseTitle: 'Test Admin text',
            isCmoOrRequest: 'Request',
            addDocument: [
              {
                id: '4867c28c-845f-46ed-90a7-c3bc0ae73454',
                value: {
                  uploadedDocument: responseUploadedDoc,
                },
              },
            ],
            requestMadeBy: 'Legal Officer',
            isResponseRequired: 'Yes',
            selectPartyNotify: 'Both parties',
            selectPartyRespond: 'Respondent',
          },
        },
        {
          id: '95263ac2-c8b3-40ed-9bf5-41fcd7dc2b16',
          value: {
            date: '11 May 2023',
            from: 'Admin',
            enterResponseTitle: 'Test Admin text',
            isCmoOrRequest: 'Request',
            addDocument: [
              {
                id: '4867c28c-845f-46ed-90a7-c3bc0ae73454',
                value: {
                  uploadedDocument: responseUploadedDoc,
                },
              },
            ],
            requestMadeBy: 'Legal Officer',
            isResponseRequired: 'No',
            selectPartyNotify: 'Both parties',
          },
        },
      ],
    },
  },
  {
    id: '3',
    value: {
      applicant: Applicant.CLAIMANT,
      date: '2022-05-05',
      type: 'Amend my claim',
      copyToOtherPartyYesOrNo: YesOrNo.YES,
      details: 'Test application details text',
      number: '1',
      status: 'notViewedYet',
      dueDate: '2022-05-12',
      applicationState: 'notViewedYet',
      documentUpload: applicationUploadedDoc,
      respondCollection: [
        {
          id: '95263ac2-c8b3-40ed-9bf5-41fcd7dc2b15',
          value: {
            date: '11 May 2023',
            from: 'Respondent',
            response: 'Test respondent response text',
            copyToOtherParty: YesOrNo.YES,
            supportingMaterial: [
              {
                id: '4867c28c-845f-46ed-90a7-c3bc0ae73454',
                value: {
                  uploadedDocument: responseUploadedDoc,
                },
              },
            ],
            hasSupportingMaterial: YesOrNo.YES,
          },
        },
        {
          id: '95263ac2-c8b3-40ed-9bf5-41fcd7dc2b16',
          value: {
            date: '11 May 2023',
            from: 'Admin',
            enterResponseTitle: 'Test Admin text',
            isCmoOrRequest: 'Request',
            addDocument: [
              {
                id: '4867c28c-845f-46ed-90a7-c3bc0ae73454',
                value: {
                  uploadedDocument: responseUploadedDoc,
                },
              },
            ],
            requestMadeBy: 'Legal Officer',
            isResponseRequired: 'No',
            selectPartyNotify: 'Both parties',
            viewedByClaimant: 'Yes',
          },
        },
        {
          id: '95263ac2-c8b3-40ed-9bf5-41fcd7dc2b16',
          value: {
            date: '11 May 2023',
            from: 'Admin',
            enterResponseTitle: 'Test Admin text',
            isCmoOrRequest: 'Order',
            addDocument: [
              {
                id: '4867c28c-845f-46ed-90a7-c3bc0ae73454',
                value: {
                  uploadedDocument: responseUploadedDoc,
                },
              },
            ],
            requestMadeBy: 'Legal Officer',
            isResponseRequired: 'No',
            selectPartyNotify: 'Both parties',
          },
        },
      ],
    },
  },
];

export const mockTseAdminClaimantRespondNotViewed: GenericTseApplicationTypeItem[] = [
  {
    id: '1',
    value: {
      applicant: Applicant.CLAIMANT,
      date: '2022-05-05',
      type: 'Amend my claim',
      copyToOtherPartyYesOrNo: YesOrNo.YES,
      details: 'Test application details text',
      number: '1',
      dueDate: '2022-05-12',
      applicationState: HubLinkStatus.NOT_VIEWED,
      documentUpload: applicationUploadedDoc,
      respondCollection: [
        {
          id: '95263ac2-c8b3-40ed-9bf5-41fcd7dc2b14',
          value: {
            date: '11 May 2023',
            from: Applicant.ADMIN,
            enterResponseTitle: 'Test Admin text',
            isCmoOrRequest: 'Request',
            addDocument: [
              {
                id: '4867c28c-845f-46ed-90a7-c3bc0ae73454',
                value: {
                  uploadedDocument: responseUploadedDoc,
                },
              },
            ],
            requestMadeBy: 'Legal Officer',
            isResponseRequired: 'Yes',
            selectPartyNotify: Parties.BOTH_PARTIES,
            selectPartyRespond: Applicant.CLAIMANT,
          },
        },
        {
          id: '95263ac2-c8b3-40ed-9bf5-41fcd7dc2b13',
          value: {
            date: '11 May 2023',
            from: Applicant.CLAIMANT,
            response: 'Test claimant response text',
            copyToOtherParty: YesOrNo.YES,
            supportingMaterial: [
              {
                id: '4867c28c-845f-46ed-90a7-c3bc0ae73454',
                value: {
                  uploadedDocument: responseUploadedDoc,
                },
              },
            ],
            hasSupportingMaterial: YesOrNo.YES,
          },
        },
      ],
    },
  },
];

export const mockTseAdminClaimantRespondWaitingForTrib: GenericTseApplicationTypeItem[] = [
  {
    id: '1',
    value: {
      applicant: Applicant.CLAIMANT,
      date: '2022-05-05',
      type: 'Amend my claim',
      copyToOtherPartyYesOrNo: YesOrNo.YES,
      details: 'Test application details text',
      number: '1',
      dueDate: '2022-05-12',
      applicationState: HubLinkStatus.WAITING_FOR_TRIBUNAL,
      documentUpload: applicationUploadedDoc,
      respondCollection: [
        {
          id: '95263ac2-c8b3-40ed-9bf5-41fcd7dc2b14',
          value: {
            date: '11 May 2023',
            from: Applicant.ADMIN,
            enterResponseTitle: 'Test Admin text',
            isCmoOrRequest: 'Request',
            addDocument: [
              {
                id: '4867c28c-845f-46ed-90a7-c3bc0ae73454',
                value: {
                  uploadedDocument: responseUploadedDoc,
                },
              },
            ],
            requestMadeBy: 'Legal Officer',
            isResponseRequired: 'Yes',
            selectPartyNotify: Parties.BOTH_PARTIES,
            selectPartyRespond: Applicant.CLAIMANT,
          },
        },
        {
          id: '95263ac2-c8b3-40ed-9bf5-41fcd7dc2b13',
          value: {
            date: '11 May 2023',
            from: Applicant.CLAIMANT,
            response: 'Test claimant response text',
            copyToOtherParty: YesOrNo.YES,
            supportingMaterial: [
              {
                id: '4867c28c-845f-46ed-90a7-c3bc0ae73454',
                value: {
                  uploadedDocument: responseUploadedDoc,
                },
              },
            ],
            hasSupportingMaterial: YesOrNo.YES,
          },
        },
      ],
    },
  },
];

export const mockTseRespondentRespondsToAdminRequestNotViewed: GenericTseApplicationTypeItem[] = [
  {
    id: '1',
    value: {
      applicant: Applicant.CLAIMANT,
      date: '2022-05-05',
      type: 'Amend my claim',
      copyToOtherPartyYesOrNo: YesOrNo.YES,
      details: 'Test application details text',
      number: '1',
      dueDate: '2022-05-12',
      applicationState: HubLinkStatus.NOT_VIEWED,
      documentUpload: applicationUploadedDoc,
      respondCollection: [
        {
          id: '95263ac2-c8b3-40ed-9bf5-41fcd7dc2b14',
          value: {
            date: '11 May 2023',
            from: Applicant.ADMIN,
            enterResponseTitle: 'Test Admin text',
            isCmoOrRequest: 'Request',
            addDocument: [
              {
                id: '4867c28c-845f-46ed-90a7-c3bc0ae73454',
                value: {
                  uploadedDocument: responseUploadedDoc,
                },
              },
            ],
            requestMadeBy: 'Legal Officer',
            isResponseRequired: YesOrNo.YES,
            selectPartyNotify: Parties.BOTH_PARTIES,
            selectPartyRespond: Applicant.RESPONDENT,
          },
        },
        {
          id: '95263ac2-c8b3-40ed-9bf5-41fcd7dc2b13',
          value: {
            date: '11 May 2023',
            from: Applicant.RESPONDENT,
            response: 'Test respondent response text',
            copyToOtherParty: YesOrNo.YES,
            supportingMaterial: [
              {
                id: '4867c28c-845f-46ed-90a7-c3bc0ae73454',
                value: {
                  uploadedDocument: responseUploadedDoc,
                },
              },
            ],
            hasSupportingMaterial: YesOrNo.YES,
          },
        },
      ],
    },
  },
];

export const mockTseRespondentRespondsToAdminRequestWaitingForTrib: GenericTseApplicationTypeItem[] = [
  {
    id: '1',
    value: {
      applicant: Applicant.CLAIMANT,
      date: '2022-05-05',
      type: 'Amend my claim',
      copyToOtherPartyYesOrNo: YesOrNo.YES,
      details: 'Test application details text',
      number: '1',
      dueDate: '2022-05-12',
      applicationState: HubLinkStatus.WAITING_FOR_TRIBUNAL,
      documentUpload: applicationUploadedDoc,
      respondCollection: [
        {
          id: '95263ac2-c8b3-40ed-9bf5-41fcd7dc2b14',
          value: {
            date: '11 May 2023',
            from: Applicant.ADMIN,
            enterResponseTitle: 'Test Admin text',
            isCmoOrRequest: 'Request',
            addDocument: [
              {
                id: '4867c28c-845f-46ed-90a7-c3bc0ae73454',
                value: {
                  uploadedDocument: responseUploadedDoc,
                },
              },
            ],
            requestMadeBy: 'Legal Officer',
            isResponseRequired: YesOrNo.YES,
            selectPartyNotify: Parties.BOTH_PARTIES,
            selectPartyRespond: Applicant.RESPONDENT,
          },
        },
        {
          id: '95263ac2-c8b3-40ed-9bf5-41fcd7dc2b13',
          value: {
            date: '11 May 2023',
            from: Applicant.RESPONDENT,
            response: 'Test respondent response text',
            copyToOtherParty: YesOrNo.YES,
            supportingMaterial: [
              {
                id: '4867c28c-845f-46ed-90a7-c3bc0ae73454',
                value: {
                  uploadedDocument: responseUploadedDoc,
                },
              },
            ],
            hasSupportingMaterial: YesOrNo.YES,
          },
        },
      ],
    },
  },
];

import { YesOrNo } from '../../../main/definitions/case';
import { Applicant } from '../../../main/definitions/constants';

import {
  applicationUploadedDoc,
  decisionUploadedDoc1,
  decisionUploadedDoc2,
  responseUploadedDoc,
} from './mockUserCaseWithDecisionsAndJudgments';

export const mockGenericTseCollection = [
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
      ],
    },
  },
];

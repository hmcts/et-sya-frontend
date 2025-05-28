import {
  CaseType,
  CaseTypeId,
  CaseWithId,
  EmailOrPost,
  HearingPanelPreference,
  HearingPreference,
  Sex,
  YesOrNo,
} from '../../../main/definitions/case';
import { DocumentType, DocumentTypeItem } from '../../../main/definitions/complexTypes/documentTypeItem';
import { SendNotificationType } from '../../../main/definitions/complexTypes/sendNotificationTypeItem';
import { Applicant } from '../../../main/definitions/constants';
import { CaseState } from '../../../main/definitions/definition';

export const applicationUploadedDoc = {
  document_url: 'uuid1',
  document_filename: 'mockApplicationDocumentUpload',
  document_binary_url: 'mockCreationDate',
  createdOn: 'Test date',
  mimetype: 'test',
  document_size: 5,
  document_mime_type: 'pdf',
};

export const responseUploadedDoc = {
  document_url: 'uuid2',
  document_filename: 'mockResponseDocumentUpload',
  document_binary_url: 'mockCreationDate',
  createdOn: 'Test date',
  mimetype: 'test',
  document_size: 5,
  document_mime_type: 'pdf',
};

export const decisionUploadedDoc1 = {
  document_url: 'uuid3',
  document_filename: 'mockDecisionDocumentUpload1',
  document_binary_url: 'mockCreationDate',
  createdOn: 'Test date',
  document_mime_type: 'test',
  document_size: 5,
};
export const decisionUploadedDoc2 = {
  document_url: 'uuid4',
  document_filename: 'mockDecisionDocumentUpload2',
  document_binary_url: 'mockCreationDate',
  createdOn: 'Test date',
  mimetype: 'test',
  document_size: 5,
  document_mime_type: 'pdf',
};

export const judgmentUploadedDoc1 = {
  document_url: 'uuid5',
  document_filename: 'mockJudgmentDocumentUpload',
  document_binary_url: 'mockCreationDate',
  createdOn: 'Test date',
  document_mime_type: 'test',
  document_size: 5,
};

const judgmentDocType: DocumentType = {
  shortDescription: 'Judgment doc 1',
  uploadedDocument: judgmentUploadedDoc1,
};

const judgmentDoc = {
  value: judgmentDocType,
} as DocumentTypeItem;

export const caseWithDecisionsAndJudgments: CaseWithId = {
  id: 'testId',
  ethosCaseReference: '6000006/2023',
  feeGroupReference: '1669195565007471',
  managingOffice: 'Bristol',
  tribunalCorrespondenceEmail: 'bristolet@justice.gov.uk',
  tribunalCorrespondenceTelephone: '0117 929 8261',
  state: CaseState.ACCEPTED,
  caseTypeId: CaseTypeId.ENGLAND_WALES,
  claimantRepresentedQuestion: YesOrNo.NO,
  caseType: CaseType.SINGLE,
  firstName: 'Dave',
  lastName: 'Tester',
  email: 'person@gmail.com',
  telNumber: '07666666666',
  address1: '35 Bridge Road',
  addressTown: 'Erith',
  addressPostcode: 'DA8 2DE',
  addressCountry: 'United Kingdom',
  dobDate: { year: '1989', month: '01', day: '01' },
  claimantSex: Sex.MALE,
  jobTitle: 'Tester',
  startDate: { year: '2022', month: '01', day: '01' },
  noticeEnds: { year: '2022', month: '02', day: '01' },
  hearingPreferences: [HearingPreference.VIDEO, HearingPreference.PHONE],
  hearingPanelPreference: HearingPanelPreference.JUDGE,
  hearingPanelPreferenceReasonJudge: 'Judge test reason',
  hearingPanelPreferenceReasonPanel: '',
  claimantContactPreference: EmailOrPost.EMAIL,
  createdDate: '11 May 2023',
  lastModified: '12 May 2023',
  respondents: [
    {
      respondentName: 'Another Person',
      respondentAddress1: '35 Bridge Road',
      respondentAddressTown: 'Erith',
      respondentAddressCountry: 'United Kingdom',
      respondentAddressPostcode: 'DA8 2DE',
      acasCert: YesOrNo.YES,
      acasCertNum: '123',
      ccdId: '5f69a174-fce3-4286-a13c-58832514be9e',
    },
  ],
  claimantWorkAddressQuestion: YesOrNo.YES,
  workAddress1: '35 Bridge Road',
  workAddressTown: 'Erith',
  workAddressCountry: 'United Kingdom',
  workAddressPostcode: 'DA8 2DE',
  et3ResponseReceived: false,
  submittedDate: { year: '1989', month: '01', day: '01' },
  responseEt3FormDocumentDetail: [
    {
      id: '0ae5a81e-bf18-4e91-8630-ecd8d48ecc76',
      description: '',
      type: 'et3Supporting',
    },
  ],
  genericTseApplicationCollection: [
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
          {
            id: '2',
            value: {
              date: '2022-05-05',
              decision: 'Granted',
              decisionMadeBy: 'Judge',
              typeOfDecision: 'Judgment',
              selectPartyNotify: 'Both parties',
              decisionMadeByFullName: 'Mr Test Judge',
              decisionState: 'inProgress',
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
        ],
      },
    },
  ],
  sendNotificationCollection: [
    {
      id: 'a07ec825-85ae-4041-81da-126de3ad7a60',
      value: {
        sendNotificationSubjectString: 'Judgment',
        sendNotificationResponseTribunal: YesOrNo.YES,
        sendNotificationTitle: 'testNotification1',
        sendNotificationUploadDocument: [judgmentDoc],
      } as SendNotificationType,
      redirectUrl: '/judgment-details/a07ec825-85ae-4041-81da-126de3ad7a60?lng=en',
      statusColor: '--turquoise',
      displayStatus: 'Viewed',
    },
    {
      id: '8ee98b7f-9d0c-46e4-94d9-2eb78e6a898a',
      value: {
        sendNotificationSubjectString: 'Judgment',
        sendNotificationResponseTribunal: YesOrNo.YES,
        sendNotificationTitle: 'testNotification2',
      } as SendNotificationType,
      redirectUrl: '/judgment-details/8ee98b7f-9d0c-46e4-94d9-2eb78e6a898a?lng=en',
      statusColor: '--turquoise',
      displayStatus: 'Viewed',
    },
  ],
};

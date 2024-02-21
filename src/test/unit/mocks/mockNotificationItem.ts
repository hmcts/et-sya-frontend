import { Document, YesOrNo } from '../../../main/definitions/case';
import { DocumentType, DocumentTypeItem } from '../../../main/definitions/complexTypes/documentTypeItem';
import {
  SendNotificationType,
  SendNotificationTypeItem,
} from '../../../main/definitions/complexTypes/sendNotificationTypeItem';
import { Applicant, NotificationSubjects, Parties, ResponseRequired } from '../../../main/definitions/constants';
import { HubLinkStatus } from '../../../main/definitions/hub';

export const doc: Document = {
  document_url: 'uuid',
  document_filename: 'test.pdf',
  document_binary_url: '',
  document_size: 1000,
  document_mime_type: 'pdf',
};

export const docType: DocumentType = {
  shortDescription: 'Short description',
  uploadedDocument: doc,
};

export const docItem: DocumentTypeItem = {
  value: docType,
};

export const notificationType: SendNotificationType = {
  number: '1',
  sendNotificationSelectHearing: {
    selectedLabel: 'Hearing',
  },
  date: '2019-05-02',
  sentBy: 'Tribunal',
  sendNotificationCaseManagement: 'Case management order',
  sendNotificationResponseTribunal: 'Yes',
  sendNotificationSelectParties: 'Both parties',
  sendNotificationAdditionalInfo: 'Additional info',
  sendNotificationUploadDocument: [docItem],
  sendNotificationWhoCaseOrder: 'Judge',
  sendNotificationFullName: 'Bob',
  sendNotificationNotify: 'Both parties',
  notificationState: 'notViewedYet',
  sendNotificationSubjectString: NotificationSubjects.ORDER_OR_REQUEST,
  sendNotificationSubject: [NotificationSubjects.ORDER_OR_REQUEST],
};

export const notificationTypeOther: SendNotificationType = {
  date: '23 August 2023',
  number: '1',
  notificationState: 'notViewedYet',
  sendNotificationTitle: 'Other type test',
  sendNotificationLetter: YesOrNo.NO,
  sendNotificationNotify: 'Both parties',
  sendNotificationSentBy: 'Tribunal',
  sendNotificationSubject: [NotificationSubjects.GENERAL_CORRESPONDENCE],
  sendNotificationSubjectString: NotificationSubjects.GENERAL_CORRESPONDENCE,
  sendNotificationAdditionalInfo: 'Additional info',
  sendNotificationUploadDocument: [docItem],
  sendNotificationResponsesCount: '0',
  sendNotificationResponseTribunalTable: YesOrNo.YES,
};

export const notificationResponseRequired: SendNotificationType = {
  number: '1',
  sendNotificationSelectHearing: {
    selectedLabel: 'Hearing',
  },
  date: '2019-05-02',
  sentBy: 'Tribunal',
  sendNotificationCaseManagement: 'Order',
  sendNotificationResponseTribunal: 'Yes - view document for details',
  sendNotificationSelectParties: 'Both', //Respondent only
  sendNotificationAdditionalInfo: 'Additional info',
  sendNotificationUploadDocument: [docItem],
  sendNotificationWhoCaseOrder: 'Judge',
  sendNotificationFullName: 'Bob',
  sendNotificationNotify: 'Both',
  notificationState: 'notStartedYet',
  sendNotificationSubjectString: NotificationSubjects.ORDER_OR_REQUEST,
  sendNotificationSubject: [NotificationSubjects.ORDER_OR_REQUEST],
};

export const notificationRespondentRequiredtoRespond: SendNotificationType = {
  number: '1',
  sendNotificationSelectHearing: {
    selectedLabel: 'Hearing',
  },
  date: '2019-05-02',
  sentBy: 'Tribunal',
  sendNotificationCaseManagement: 'Order',
  sendNotificationResponseTribunal: 'Yes - view document for details',
  sendNotificationSelectParties: 'Respondent only',
  sendNotificationAdditionalInfo: 'Additional info',
  sendNotificationUploadDocument: [docItem],
  sendNotificationWhoCaseOrder: 'Judge',
  sendNotificationFullName: 'Bob',
  sendNotificationNotify: 'Both',
  notificationState: 'notViewedYet',
  sendNotificationSubjectString: NotificationSubjects.ORDER_OR_REQUEST,
  sendNotificationSubject: [NotificationSubjects.ORDER_OR_REQUEST],
};

export const notificationViewed: SendNotificationType = {
  number: '1',
  sendNotificationSelectHearing: {
    selectedLabel: 'Hearing',
  },
  date: '2019-05-02',
  sentBy: 'Tribunal',
  sendNotificationCaseManagement: 'Order',
  sendNotificationResponseTribunal: 'Yes - view document for details',
  sendNotificationSelectParties: 'Respondent only',
  sendNotificationAdditionalInfo: 'Additional info',
  sendNotificationUploadDocument: [docItem],
  sendNotificationWhoCaseOrder: 'Judge',
  sendNotificationFullName: 'Bob',
  sendNotificationNotify: 'Both',
  notificationState: 'viewed',
  sendNotificationSubjectString: NotificationSubjects.ORDER_OR_REQUEST,
  sendNotificationSubject: [NotificationSubjects.ORDER_OR_REQUEST],
};

export const notificationSubmitted: SendNotificationType = {
  number: '1',
  sendNotificationSelectHearing: {
    selectedLabel: 'Hearing',
  },
  date: '2019-05-02',
  sentBy: 'Tribunal',
  sendNotificationCaseManagement: 'Order',
  sendNotificationResponseTribunal: 'Yes - view document for details',
  sendNotificationSelectParties: 'Claimant only',
  sendNotificationAdditionalInfo: 'Additional info',
  sendNotificationUploadDocument: [docItem],
  sendNotificationWhoCaseOrder: 'Judge',
  sendNotificationFullName: 'Bob',
  sendNotificationNotify: 'Both',
  notificationState: 'viewed',
  sendNotificationSubjectString: NotificationSubjects.ORDER_OR_REQUEST,
  sendNotificationSubject: [NotificationSubjects.ORDER_OR_REQUEST],
  respondCollection: [
    {
      id: '123-abc-123',
      value: {
        from: 'Claimant',
        copyToOtherParty: 'Yes',
      },
    },
  ],
};

export const notificationWithResponses: SendNotificationType = {
  number: '1',
  sendNotificationSelectHearing: {
    selectedLabel: 'Hearing',
  },
  date: '2019-05-02',
  sentBy: 'Tribunal',
  sendNotificationCaseManagement: 'Case management order',
  sendNotificationResponseTribunal: 'Yes',
  sendNotificationSelectParties: 'Both parties',
  sendNotificationAdditionalInfo: 'Additional info',
  sendNotificationUploadDocument: [docItem],
  sendNotificationWhoCaseOrder: 'Judge',
  sendNotificationFullName: 'Bob',
  sendNotificationNotify: 'Both parties',
  notificationState: 'viewed',
  sendNotificationSubjectString: NotificationSubjects.ORDER_OR_REQUEST,
  sendNotificationSubject: [NotificationSubjects.ORDER_OR_REQUEST],
  respondCollection: [
    {
      id: '123-abc-123',
      value: {
        from: Applicant.CLAIMANT,
        copyToOtherParty: YesOrNo.YES,
        date: '2019-05-02',
        response: 'Some claimant response text',
        hasSupportingMaterial: YesOrNo.NO,
        responseState: undefined,
      },
    },
    {
      id: '123-abc-123',
      value: {
        from: Applicant.RESPONDENT,
        copyToOtherParty: YesOrNo.YES,
        date: '2019-05-10',
        response: 'Some respondent response text',
        hasSupportingMaterial: YesOrNo.NO,
      },
    },
  ],
  respondNotificationTypeCollection: [
    {
      id: '1',
      value: {
        isClaimantResponseDue: ResponseRequired.YES,
        respondNotificationAdditionalInfo: 'additional info',
        respondNotificationCaseManagementMadeBy: 'Legal officer',
        respondNotificationCmoOrRequest: 'Case management order',
        respondNotificationDate: '2019-05-03',
        respondNotificationFullName: 'Judge Dredd',
        respondNotificationPartyToNotify: Parties.BOTH_PARTIES,
        respondNotificationRequestMadeBy: 'Legal officer',
        respondNotificationResponseRequired: ResponseRequired.YES,
        respondNotificationTitle: 'tribunal response title text',
        respondNotificationWhoRespond: Parties.BOTH_PARTIES,
      },
    },
  ],
};

export const notificationWithViewedResponses: SendNotificationType = {
  number: '1',
  sendNotificationSelectHearing: {
    selectedLabel: 'Hearing',
  },
  date: '2019-05-02',
  sentBy: 'Tribunal',
  sendNotificationCaseManagement: 'Case management order',
  sendNotificationResponseTribunal: 'Yes',
  sendNotificationSelectParties: 'Both parties',
  sendNotificationAdditionalInfo: 'Additional info',
  sendNotificationUploadDocument: [docItem],
  sendNotificationWhoCaseOrder: 'Judge',
  sendNotificationFullName: 'Bob',
  sendNotificationNotify: 'Both parties',
  notificationState: 'viewed',
  sendNotificationSubjectString: NotificationSubjects.ORDER_OR_REQUEST,
  sendNotificationSubject: [NotificationSubjects.ORDER_OR_REQUEST],
  respondCollection: [
    {
      id: '123-abc-123',
      value: {
        from: Applicant.CLAIMANT,
        copyToOtherParty: YesOrNo.YES,
        date: '2019-05-02',
        response: 'Some claimant response text',
        hasSupportingMaterial: YesOrNo.NO,
        responseState: HubLinkStatus.VIEWED,
      },
    },
    {
      id: '123-abc-123',
      value: {
        from: Applicant.RESPONDENT,
        copyToOtherParty: YesOrNo.YES,
        date: '2019-05-10',
        response: 'Some respondent response text',
        hasSupportingMaterial: YesOrNo.NO,
      },
    },
  ],
};

export const eccNotification = {
  date: '1 December 2023',
  number: '1',
  sendNotificationTitle: 'ECC',
  sendNotificationSubjectString: 'Employer Contract Claim',
  notificationState: 'viewed',
  sendNotificationLetter: YesOrNo.NO,
  sendNotificationResponsesCount: '0',
  sendNotificationSubject: ['Employer Contract Claim'],
  sendNotificationEccQuestion: 'Notice of Employer Contract Claim',
  sendNotificationSentBy: 'Tribunal',
  sendNotificationResponseTribunalTable: YesOrNo.YES,
  sendNotificationNotify: 'Both parties',
};

export const mockNotificationItem: SendNotificationTypeItem = {
  id: '2c6ae9f6-66cd-4a6b-86fa-0eabcb64bf28',
  value: notificationType,
};

export const mockNotificationItemOther: SendNotificationTypeItem = {
  id: '2c6ae9f6-66cd-4a6b-86fa-0eabcb64bf29',
  value: notificationTypeOther,
};

export const mockNotificationResponseReq: SendNotificationTypeItem = {
  id: '2c6ae9f6-66cd-4a6b-86fa-0eabcb64bf28',
  value: notificationResponseRequired,
};

export const mockNotificationRespondOnlyReq: SendNotificationTypeItem = {
  id: '2c6ae9f6-66cd-4a6b-86fa-0eabcb64bf28',
  value: notificationRespondentRequiredtoRespond,
};

export const mockNotificationViewed: SendNotificationTypeItem = {
  id: '2c6ae9f6-66cd-4a6b-86fa-0eabcb64bf28',
  value: notificationViewed,
};

export const mockNotificationSubmitted: SendNotificationTypeItem = {
  id: '2c6ae9f6-66cd-4a6b-86fa-0eabcb64bf28',
  value: notificationSubmitted,
};

export const mockECCNotification: SendNotificationTypeItem = {
  id: '6423be5b-0b82-462a-af1d-5f1df39686ab',
  value: eccNotification,
};

export const mockNotificationWithResponses: SendNotificationTypeItem = {
  id: '6423be5b-0b82-462a-af1d-5f1df39686ab',
  value: notificationWithResponses,
};

export const mockNotificationWithViewedResponses: SendNotificationTypeItem = {
  id: '6423be5b-0b82-462a-af1d-5f1df39686ab',
  value: notificationWithViewedResponses,
};

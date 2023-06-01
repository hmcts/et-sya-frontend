import { Document } from '../../../main/definitions/case';
import { DocumentType, DocumentTypeItem } from '../../../main/definitions/complexTypes/documentTypeItem';
import {
  SendNotificationType,
  SendNotificationTypeItem,
} from '../../../main/definitions/complexTypes/sendNotificationTypeItem';
import { NotificationSubjects } from '../../../main/definitions/constants';

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
  sendNotificationCaseManagement: 'Order',
  sendNotificationResponseTribunal: 'Required',
  sendNotificationSelectParties: 'Both',
  sendNotificationAdditionalInfo: 'Additional info',
  sendNotificationUploadDocument: [docItem],
  sendNotificationWhoCaseOrder: 'Judge',
  sendNotificationFullName: 'Bob',
  sendNotificationNotify: 'Both',
  notificationState: 'notStartedYet',
  sendNotificationSubject: [NotificationSubjects.GENERAL_CORRESPONDENCE],
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
  sendNotificationSubject: [NotificationSubjects.GENERAL_CORRESPONDENCE],
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
  notificationState: 'notStartedYet',
  sendNotificationSubject: [NotificationSubjects.GENERAL_CORRESPONDENCE],
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
  sendNotificationSubject: [NotificationSubjects.GENERAL_CORRESPONDENCE],
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
  sendNotificationSubject: [NotificationSubjects.GENERAL_CORRESPONDENCE],
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

export const mockNotificationItem: SendNotificationTypeItem = {
  id: '2c6ae9f6-66cd-4a6b-86fa-0eabcb64bf28',
  value: notificationType,
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

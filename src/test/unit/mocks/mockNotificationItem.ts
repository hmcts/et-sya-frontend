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

export const mockNotificationItem: SendNotificationTypeItem = {
  id: '2c6ae9f6-66cd-4a6b-86fa-0eabcb64bf28',
  value: notificationType,
};

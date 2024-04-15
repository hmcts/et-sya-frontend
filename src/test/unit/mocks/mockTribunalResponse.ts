import { RespondNotificationTypeItem } from '../../../main/definitions/complexTypes/sendNotificationTypeItem';

export const mockTribunalResponse: RespondNotificationTypeItem = {
  id: '6b5423c8-7a03-45d0-b08d-0960db525dc0',
  value: {
    state: 'notStartedYet',
    isClaimantResponseDue: 'Yes',
    respondNotificationDate: '20 December 2023',
    respondNotificationTitle: 'Tribunal response 1',
    respondNotificationFullName: 'bhdgfh',
    respondNotificationWhoRespond: 'Claimant only',
    respondNotificationCmoOrRequest: 'Case management order',
    respondNotificationPartyToNotify: 'Both parties',
    respondNotificationAdditionalInfo: 'dgfdf',
    respondNotificationUploadDocument: [
      {
        id: '7116daac-5dad-44d2-8ab4-82d892ba3adf',
        value: {
          shortDescription: 'jghfj',
          uploadedDocument: {
            document_url: 'http://localhost:5005/documents/8026ab44-2148-4b01-9ff8-2d5f63900203',
            document_filename: 'General-Transport-Conditions-EN-PT-SET23.pdf',
            document_binary_url: 'http://localhost:5005/documents/8026ab44-2148-4b01-9ff8-2d5f63900203/binary',
          },
        },
      },
    ],
    respondNotificationResponseRequired: 'Yes',
    respondNotificationCaseManagementMadeBy: 'Legal officer',
  },
};

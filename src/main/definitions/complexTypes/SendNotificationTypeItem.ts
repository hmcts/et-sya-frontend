import { DocumentApiModel } from '../api/caseApiResponse';

export interface SendNotificationTypeItem {
  id?: string;
  value?: {
    date: string;
    sendNotificationTitle: string;
    sendNotificationLetter: string;
    sendNotificationUploadDocument: DocumentApiModel[];
    sendNotificationSubject: string[];
    sendNotificationAdditionalInfo: string;
    sendNotificationNotify: string;
    sendNotificationSelectHearing: unknown; // todo fix this to type DynamicFixedListType[];
    sendNotificationCaseManagement: string;
    sendNotificationResponseTribunal: string;
    sendNotificationWhoCaseOrder: string;
    sendNotificationSelectParties: string;
    sendNotificationFullName: string;
    sendNotificationFullName2: string;
    sendNotificationDetails: string;
    sendNotificationRequestMadeBy: string;
    respondCollection: PseResponseTypeItem[];
  };
}

interface PseResponseTypeItem {
  id: string;
  value: {
    date: string;
    from: string;
    response: string;
    hasSupportingMaterial: string;
    supportingMaterial: DocumentApiModel[];
    copyToOtherParty: string;
    copyNoGiveDetails: string;
  };
}

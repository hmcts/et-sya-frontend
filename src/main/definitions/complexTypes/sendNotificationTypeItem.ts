import { DocumentTypeItem } from './documentTypeItem';

export interface SendNotificationTypeItem {
  id?: string;
  value?: SendNotificationType;
  redirectUrl?: string;
  statusColor?: string;
  displayStatus?: string;
}

export interface SendNotificationType {
  number?: string;
  sendNotificationTitle?: string;

  //Hearing title with date
  sendNotificationSelectHearing?: SendNotificationSelectHearingItem;

  //Date sent
  date?: string;

  //Static value
  sentBy?: string;

  sendNotificationSubject?: string[];

  //Order or request?
  sendNotificationCaseManagement?: string;

  //Response due
  sendNotificationResponseTribunal?: string;

  //Party or parties to respond
  sendNotificationSelectParties?: string;

  sendNotificationAdditionalInfo?: string;

  sendNotificationUploadDocument?: DocumentTypeItem[];

  //Case management order made by Legal officer, Judge or CaseWorker
  sendNotificationWhoCaseOrder?: string;

  //Request made by Legal officer, Judge or CaseWorker
  sendNotificationRequestMadeBy?: string;

  //Full name who made the order
  sendNotificationFullName?: string;

  //Full name who made the judgment
  sendNotificationFullName2?: string;

  //Notification sent to Both parties, Claimant only or Respondent only
  sendNotificationNotify?: string;
  sendNotificationEccQuestion?: string;

  //Indicates the notification status
  notificationState?: string;
  respondCollection?: PseResponseTypeItem[];
}

export interface PseResponseTypeItem {
  id?: string;
  value?: PseResponseType;
}

export interface SendNotificationSelectHearingItem {
  // DynamicFixedListType
  selectedCode?: string;
  selectedLabel?: string;
}

export interface PseResponseType {
  from?: string;
  copyToOtherParty?: string;
  supportingMaterial?: DocumentTypeItem[];
}

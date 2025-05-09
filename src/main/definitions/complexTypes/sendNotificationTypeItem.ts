import { YesOrNo } from '../case';
import { TypeItem } from '../util-types';

import { DocumentTypeItem } from './documentTypeItem';

export interface SendNotificationTypeItem {
  id?: string;
  value?: SendNotificationType;
  redirectUrl?: string;
  respondUrl?: string;
  statusColor?: string;
  displayStatus?: string;
  linkText?: string;
  needsResponse?: boolean;
  showAlert?: boolean;
}

export interface SendNotificationType {
  number?: string;
  sendNotificationTitle?: string;

  sendNotificationLetter?: YesOrNo;

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

  sendNotificationResponsesCount?: string;

  sendNotificationUploadDocument?: DocumentTypeItem[];

  sendNotificationResponseTribunalTable?: YesOrNo;

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
  sendNotificationDecision?: string;
  sendNotificationSentBy?: string;
  sendNotificationWhoMadeJudgement?: string;

  //Indicates the notification status
  notificationState?: string;
  respondCollection?: TypeItem<PseResponseType>[];
  respondStoredCollection?: TypeItem<PseResponseType>[];
  respondNotificationTypeCollection?: TypeItem<RespondNotificationType>[];
  sendNotificationSubjectString?: string;
}

export interface RespondNotificationType {
  respondNotificationDate?: string;
  respondNotificationTitle?: string;
  respondNotificationAdditionalInfo?: string;
  respondNotificationUploadDocument?: DocumentTypeItem[];
  respondNotificationCmoOrRequest?: string;
  respondNotificationResponseRequired?: string;
  respondNotificationWhoRespond?: string;
  respondNotificationCaseManagementMadeBy?: string;
  respondNotificationRequestMadeBy?: string;
  respondNotificationFullName?: string;
  respondNotificationPartyToNotify?: string;
  state?: string;
  isClaimantResponseDue?: string;
}

export interface RespondNotificationTypeItem {
  id: string;
  value: RespondNotificationType;
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
  date?: string;
  response?: string;
  hasSupportingMaterial?: string;
  copyNoGiveDetails?: string;
  responseState?: string;
}

export interface PseResponseTypeItem {
  id: string;
  value: PseResponseType;
}

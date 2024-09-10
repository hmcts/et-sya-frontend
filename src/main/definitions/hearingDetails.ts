import { SendNotificationTypeItem } from './complexTypes/sendNotificationTypeItem';

export interface HearingDetails {
  hearingNumber: string;
  Hearing_type?: string;
  hearingDateRows?: HearingDateRow[];
  notifications?: SendNotificationTypeItem[];
}

export interface HearingDateRow {
  date: Date;
  status: string;
  venue: string;
}

export interface HearingNotification {
  viewUrl?: string;
}

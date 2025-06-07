export interface HearingDetails {
  hearingNumber: string;
  hearingType?: string;
  hearingDateRows?: HearingDateRow[];
  notifications?: HearingNotificationRow[];
}

export interface HearingDateRow {
  date: Date;
  status: string;
  venue: string;
}

export interface HearingNotificationRow {
  date?: string;
  redirectUrl: string;
  notificationTitle?: string;
  displayStatus?: string;
  statusColor?: string;
}

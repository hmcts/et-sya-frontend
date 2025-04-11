export interface HearingDetails {
  hearingNumber: string;
  Hearing_type?: string;
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
  sendNotificationTitle?: string;
  displayStatus?: string;
  statusColor?: string;
}

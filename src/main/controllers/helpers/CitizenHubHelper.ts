import { CaseWithId, YesOrNo } from '../../definitions/case';
import { GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { SendNotificationTypeItem } from '../../definitions/complexTypes/sendNotificationTypeItem';
import { Applicant, NotificationSubjects, PageUrls } from '../../definitions/constants';
import { HubLinkNames, HubLinkStatus, HubLinksStatuses } from '../../definitions/hub';

export const updateHubLinkStatuses = (userCase: CaseWithId, hubLinksStatuses: HubLinksStatuses): void => {
  if (
    hubLinksStatuses[HubLinkNames.RespondentResponse] === HubLinkStatus.NOT_YET_AVAILABLE &&
    userCase.et3ResponseReceived
  ) {
    hubLinksStatuses[HubLinkNames.RespondentResponse] = HubLinkStatus.WAITING_FOR_TRIBUNAL;
  }

  if (
    userCase.hubLinksStatuses[HubLinkNames.RespondentResponse] !== HubLinkStatus.VIEWED &&
    (userCase.responseAcknowledgementDocumentDetail?.length || userCase.responseRejectionDocumentDetail?.length)
  ) {
    userCase.hubLinksStatuses[HubLinkNames.RespondentResponse] = HubLinkStatus.NOT_VIEWED;
  }

  if (
    userCase.hubLinksStatuses[HubLinkNames.Et1ClaimForm] !== HubLinkStatus.SUBMITTED_AND_VIEWED &&
    (userCase.acknowledgementOfClaimLetterDetail?.length || userCase.rejectionOfClaimDocumentDetail?.length)
  ) {
    userCase.hubLinksStatuses[HubLinkNames.Et1ClaimForm] = HubLinkStatus.NOT_VIEWED;
  }
};

export const shouldShowSubmittedAlert = (userCase: CaseWithId): boolean => {
  return !userCase?.acknowledgementOfClaimLetterDetail?.length && !userCase?.rejectionOfClaimDocumentDetail?.length;
};

export const shouldShowAcknowledgementAlert = (userCase: CaseWithId, hubLinksStatuses: HubLinksStatuses): boolean => {
  return (
    !!userCase?.acknowledgementOfClaimLetterDetail?.length &&
    hubLinksStatuses[HubLinkNames.Et1ClaimForm] !== HubLinkStatus.VIEWED &&
    hubLinksStatuses[HubLinkNames.Et1ClaimForm] !== HubLinkStatus.SUBMITTED_AND_VIEWED
  );
};

export const shouldShowRejectionAlert = (userCase: CaseWithId, hubLinksStatuses: HubLinksStatuses): boolean => {
  return (
    !!userCase?.rejectionOfClaimDocumentDetail?.length &&
    hubLinksStatuses[HubLinkNames.Et1ClaimForm] !== HubLinkStatus.VIEWED &&
    hubLinksStatuses[HubLinkNames.Et1ClaimForm] !== HubLinkStatus.SUBMITTED_AND_VIEWED
  );
};

// Show response received if there's a respondent application where the respondent responded and hasn't been viewed yet
export const shouldShowRespondentResponseReceived = (applications: GenericTseApplicationTypeItem[]): boolean => {
  return applications?.some(app => {
    const responses = app.value.respondCollection;
    return (
      responses &&
      responses[responses.length - 1].value.from === Applicant.RESPONDENT &&
      app.value.applicationState === HubLinkStatus.UPDATED
    );
  });
};

// Only show new respondent applications if there are applications that are not started yet
// notStartedYet applications can also be ones where the tribunal has asked the claimant for more information.
// Therefore make sure also that there's a notStartedYet application with no requests for information
export const shouldShowRespondentApplicationReceived = (applications: GenericTseApplicationTypeItem[]): boolean => {
  return applications?.some(
    app =>
      app.value.applicationState === HubLinkStatus.NOT_STARTED_YET && app.value.claimantResponseRequired !== YesOrNo.YES
  );
};

export const shouldShowRespondentRejection = (userCase: CaseWithId, hubLinksStatuses: HubLinksStatuses): boolean => {
  return (
    !!userCase?.responseRejectionDocumentDetail?.length &&
    hubLinksStatuses[HubLinkNames.RespondentResponse] !== HubLinkStatus.VIEWED
  );
};

export const shouldShowRespondentAcknolwedgement = (
  userCase: CaseWithId,
  hubLinksStatuses: HubLinksStatuses
): boolean => {
  return (
    !!userCase?.responseAcknowledgementDocumentDetail?.length &&
    hubLinksStatuses[HubLinkNames.RespondentResponse] !== HubLinkStatus.VIEWED
  );
};

export const shouldShowJudgmentReceived = (userCase: CaseWithId, hubLinksStatuses: HubLinksStatuses): boolean => {
  return hubLinksStatuses[HubLinkNames.TribunalJudgements] === HubLinkStatus.IN_PROGRESS;
};

export const userCaseContainsGeneralCorrespondence = (notifications: SendNotificationTypeItem[]): boolean => {
  return notifications?.some(it =>
    it.value.sendNotificationSubject.includes(NotificationSubjects.GENERAL_CORRESPONDENCE)
  );
};

export const checkIfRespondentIsSystemUser = (userCase: CaseWithId): boolean => {
  const repCollection = userCase.representatives;
  const respondentCollection = userCase.respondents;

  if (!respondentCollection || !repCollection) {
    return false;
  }

  return (
    respondentCollection.every(res => repCollection.some(rep => res.ccdId === rep.respondentId)) &&
    !repCollection.some(r => r.hasMyHMCTSAccount === YesOrNo.NO || r.hasMyHMCTSAccount === undefined)
  );
};

export enum StatusesInOrderOfUrgency {
  notStartedYet = 0,
  notViewedYet = 1,
  updated = 2,
  inProgress = 3,
  viewed = 4,
  waitingForTheTribunal = 5,
}

export const activateRespondentApplicationsLink = (
  items: GenericTseApplicationTypeItem[],
  userCase: CaseWithId
): void => {
  if (!items?.length) {
    return;
  }

  const mostUrgentStatus = Math.min(
    ...items.map(o => StatusesInOrderOfUrgency[o.value.applicationState as keyof typeof StatusesInOrderOfUrgency])
  );

  userCase.hubLinksStatuses[HubLinkNames.RespondentApplications] = StatusesInOrderOfUrgency[
    mostUrgentStatus
  ] as HubLinkStatus;
};

export const shouldHubLinkBeClickable = (status: HubLinkStatus, linkName: string): boolean => {
  if (status === HubLinkStatus.NOT_YET_AVAILABLE) {
    return false;
  }

  if (status === HubLinkStatus.WAITING_FOR_TRIBUNAL && linkName !== HubLinkNames.RespondentApplications) {
    return false;
  }

  return true;
};

export const getHubLinksUrlMap = (isRespondentSystemUser: boolean): Map<string, string> => {
  return new Map<string, string>([
    [HubLinkNames.Et1ClaimForm, PageUrls.CLAIM_DETAILS],
    [HubLinkNames.RespondentResponse, PageUrls.CITIZEN_HUB_DOCUMENT_RESPONSE_RESPONDENT],
    [
      HubLinkNames.ContactTribunal,
      isRespondentSystemUser ? PageUrls.CONTACT_THE_TRIBUNAL : PageUrls.RULE92_HOLDING_PAGE,
    ],
    [HubLinkNames.RequestsAndApplications, PageUrls.YOUR_APPLICATIONS],
    [HubLinkNames.RespondentApplications, PageUrls.RESPONDENT_APPLICATIONS],
    [
      HubLinkNames.TribunalOrders,
      isRespondentSystemUser ? PageUrls.TRIBUNAL_ORDERS_AND_REQUESTS : PageUrls.RULE92_HOLDING_PAGE,
    ],
    [HubLinkNames.TribunalJudgements, PageUrls.ALL_JUDGMENTS],
    [HubLinkNames.Documents, PageUrls.ALL_DOCUMENTS],
  ]);
};

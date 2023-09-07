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
    hubLinksStatuses[HubLinkNames.RespondentResponse] !== HubLinkStatus.VIEWED &&
    (userCase.responseAcknowledgementDocumentDetail?.length || userCase.responseRejectionDocumentDetail?.length)
  ) {
    hubLinksStatuses[HubLinkNames.RespondentResponse] = HubLinkStatus.READY_TO_VIEW;
  }

  if (
    hubLinksStatuses[HubLinkNames.Et1ClaimForm] !== HubLinkStatus.SUBMITTED_AND_VIEWED &&
    (userCase.acknowledgementOfClaimLetterDetail?.length || userCase.rejectionOfClaimDocumentDetail?.length)
  ) {
    hubLinksStatuses[HubLinkNames.Et1ClaimForm] = HubLinkStatus.NOT_VIEWED;
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

// Show response received if there's a respondent application where the respondent was the last to respond
export const shouldShowRespondentResponseReceived = (applications: GenericTseApplicationTypeItem[]): boolean => {
  return applications?.some(app => {
    const responses = app.value.respondCollection;
    return (
      responses &&
      responses[responses.length - 1].value.from === Applicant.RESPONDENT &&
      responses[responses.length - 1].value.copyToOtherParty === YesOrNo.YES
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

  if (
    status === HubLinkStatus.WAITING_FOR_TRIBUNAL &&
    linkName !== HubLinkNames.RespondentApplications &&
    linkName !== HubLinkNames.RequestsAndApplications
  ) {
    return false;
  }

  return true;
};

export const getAllClaimantApplications = (userCase: CaseWithId): GenericTseApplicationTypeItem[] => {
  return userCase.genericTseApplicationCollection?.filter(item => item.value.applicant === Applicant.CLAIMANT);
};

export const getClaimantAppsAndUpdateStatusTag = (userCase: CaseWithId): void => {
  const allClaimantApplications = getAllClaimantApplications(userCase);

  if (allClaimantApplications?.length) {
    updateYourApplicationsStatusTag(allClaimantApplications, userCase);
  }
};

export const updateYourApplicationsStatusTag = (
  allClaimantApplications: GenericTseApplicationTypeItem[],
  userCase: CaseWithId
): void => {
  // Filter apps with 'waiting for tribunal' status as these may have a different citizen hub status
  const claimantAppsWaitingForTribunal = allClaimantApplications.filter(
    it => it.value.applicationState === HubLinkStatus.WAITING_FOR_TRIBUNAL
  );

  let citizenHubHighestPriorityStatus: HubLinkStatus | undefined;

  claimantAppsWaitingForTribunal.forEach(claimantApp => {
    const respondCollection = claimantApp.value?.respondCollection;
    // Only apps with 2 or more responses are eligible to have a different citizen hub status
    if (!respondCollection || respondCollection.length <= 1) {
      return;
    }

    const lastItem = respondCollection[respondCollection.length - 1];
    const secondLastItem = respondCollection[respondCollection.length - 2];
    const isAdmin = secondLastItem.value.from === Applicant.ADMIN;
    // If claimant responds to tribunal request, hub link status set to 'In progress'
    // Only set if it is not already set to 'Updated', as 'Updated' is the higher priority status
    if (
      lastItem.value.from === Applicant.CLAIMANT &&
      isAdmin &&
      citizenHubHighestPriorityStatus !== HubLinkStatus.UPDATED
    ) {
      citizenHubHighestPriorityStatus = HubLinkStatus.IN_PROGRESS;
      return;
    }
    // If respondent responds to tribunal respondent request, hub link status set to 'Updated'
    if (
      lastItem.value.from === Applicant.RESPONDENT &&
      isAdmin &&
      secondLastItem.value.selectPartyRespond === Applicant.RESPONDENT
    ) {
      citizenHubHighestPriorityStatus = HubLinkStatus.UPDATED;
    }
  });
  // citizenHubHigherPriorityStatus has now been set to either 'In progress' or 'Updated'
  // and is added to the applications priority check to display the highest priority citizen hub status
  const mostUrgentStatus = Math.min(
    ...allClaimantApplications
      .map(o => {
        const applicationState = o.value.applicationState as keyof typeof StatusesInOrderOfUrgency;
        const citizenHubStatus = citizenHubHighestPriorityStatus as keyof typeof StatusesInOrderOfUrgency;

        const citizenHubStatusPriority =
          citizenHubStatus !== undefined ? StatusesInOrderOfUrgency[citizenHubStatus] : undefined;
        const applicationStatePriority = StatusesInOrderOfUrgency[applicationState];

        return [citizenHubStatusPriority, applicationStatePriority].filter(item => item !== undefined);
      })
      .flat()
  );

  userCase.hubLinksStatuses[HubLinkNames.RequestsAndApplications] = StatusesInOrderOfUrgency[
    mostUrgentStatus
  ] as HubLinkStatus;
};

export const getHubLinksUrlMap = (isRespondentSystemUser: boolean): Map<string, string> => {
  return new Map<string, string>([
    [HubLinkNames.Et1ClaimForm, PageUrls.CLAIM_DETAILS],
    [HubLinkNames.RespondentResponse, PageUrls.CITIZEN_HUB_DOCUMENT_RESPONSE_RESPONDENT],
    [HubLinkNames.ContactTribunal, PageUrls.CONTACT_THE_TRIBUNAL],
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

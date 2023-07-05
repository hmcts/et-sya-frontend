import { CaseWithId, YesOrNo } from '../../definitions/case';
import { GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { SendNotificationTypeItem } from '../../definitions/complexTypes/sendNotificationTypeItem';
import { Applicant, NotificationSubjects } from '../../definitions/constants';
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

export const shouldShowRespondentResponseReceived = (hubLinksStatuses: HubLinksStatuses): boolean => {
  return hubLinksStatuses[HubLinkNames.RespondentResponse] === HubLinkStatus.WAITING_FOR_TRIBUNAL;
};

export const shouldShowRespondentApplicationReceived = (hubLinksStatuses: HubLinksStatuses): boolean => {
  return hubLinksStatuses[HubLinkNames.RespondentApplications] === HubLinkStatus.IN_PROGRESS;
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

export const updateYourApplicationsStatusTag = (
  allClaimantApplications: GenericTseApplicationTypeItem[],
  userCase: CaseWithId
): void => {
  const claimantAppsWaitingForTribunal = allClaimantApplications.filter(
    it => it.value.applicationState === HubLinkStatus.WAITING_FOR_TRIBUNAL
  );

  let citizenHubHighestPriorityStatus: HubLinkStatus | undefined;

  claimantAppsWaitingForTribunal.forEach(claimantApp => {
    const respondCollection = claimantApp.value?.respondCollection;

    if (!respondCollection || respondCollection.length <= 1) {
      return;
    }

    const lastItem = respondCollection[respondCollection.length - 1];
    const secondLastItem = respondCollection[respondCollection.length - 2];
    const isAdmin = secondLastItem.value.from === Applicant.ADMIN;

    if (
      lastItem.value.from === Applicant.CLAIMANT &&
      isAdmin &&
      citizenHubHighestPriorityStatus !== HubLinkStatus.UPDATED
    ) {
      citizenHubHighestPriorityStatus = HubLinkStatus.IN_PROGRESS;
      return;
    }

    if (
      lastItem.value.from === Applicant.RESPONDENT &&
      isAdmin &&
      secondLastItem.value.selectPartyRespond === Applicant.RESPONDENT
    ) {
      citizenHubHighestPriorityStatus = HubLinkStatus.UPDATED;
    }
  });

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

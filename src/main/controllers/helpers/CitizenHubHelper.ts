import { CaseWithId, YesOrNo } from '../../definitions/case';
import { GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { SendNotificationTypeItem } from '../../definitions/complexTypes/sendNotificationTypeItem';
import { NotificationSubjects } from '../../definitions/constants';
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

export const statusesInOrderOfUrgency = [
  HubLinkStatus.NOT_STARTED_YET,
  HubLinkStatus.NOT_VIEWED,
  HubLinkStatus.UPDATED,
  HubLinkStatus.IN_PROGRESS,
  HubLinkStatus.VIEWED,
  HubLinkStatus.WAITING_FOR_TRIBUNAL,
];

export const activateRespondentApplicationsLink = (
  items: GenericTseApplicationTypeItem[],
  userCase: CaseWithId
): void => {
  if (!items?.length) {
    return;
  }

  let mostUrgentStatus;
  for (const application of items) {
    const currStatus = application.value.status as HubLinkStatus;
    if (statusesInOrderOfUrgency.indexOf(currStatus) > statusesInOrderOfUrgency.indexOf(mostUrgentStatus)) {
      mostUrgentStatus = currStatus;
    }
  }
  userCase.hubLinksStatuses[HubLinkNames.RespondentApplications] = mostUrgentStatus;
};

import { CaseWithId, YesOrNo } from '../../definitions/case';
import { GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { SendNotificationTypeItem } from '../../definitions/complexTypes/sendNotificationTypeItem';
import {
  Applicant,
  NotificationSubjects,
  PageUrls,
  acknowledgementOfClaimDocTypes,
  languages,
} from '../../definitions/constants';
import { CaseState } from '../../definitions/definition';
import { HubLinkNames, HubLinkStatus, HubLinksStatuses } from '../../definitions/hub';
import { StoreNotification } from '../../definitions/storeNotification';

import { isHearingExist } from './HearingHelpers';
import { shouldShowViewRespondentContactDetails } from './RespondentContactDetailsHelper';

export const updateHubLinkStatuses = (userCase: CaseWithId, hubLinksStatuses: HubLinksStatuses): void => {
  if (isHearingExist(userCase.hearingCollection)) {
    hubLinksStatuses[HubLinkNames.HearingDetails] = HubLinkStatus.READY_TO_VIEW;
  }

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

  hubLinksStatuses[HubLinkNames.ViewRespondentContactDetails] = shouldShowViewRespondentContactDetails(userCase)
    ? HubLinkStatus.READY_TO_VIEW
    : HubLinkStatus.NOT_YET_AVAILABLE;
};

export const shouldShowSubmittedAlert = (userCase: CaseWithId): boolean => {
  return (
    !userCase?.acknowledgementOfClaimLetterDetail?.length &&
    !userCase?.rejectionOfClaimDocumentDetail?.length &&
    userCase?.state === CaseState.SUBMITTED
  );
};

export const getAcknowledgementAlert = (
  userCase: CaseWithId,
  hubLinksStatuses: HubLinksStatuses
): {
  shouldShowAlert: boolean;
  isAcknowledgementOfClaimOnly: boolean;
  respondentResponseDeadline?: string;
} => {
  const isLetterExist = !!userCase?.acknowledgementOfClaimLetterDetail?.length;
  return {
    shouldShowAlert:
      isLetterExist &&
      hubLinksStatuses[HubLinkNames.Et1ClaimForm] !== HubLinkStatus.VIEWED &&
      hubLinksStatuses[HubLinkNames.Et1ClaimForm] !== HubLinkStatus.SUBMITTED_AND_VIEWED,
    isAcknowledgementOfClaimOnly:
      isLetterExist &&
      userCase.acknowledgementOfClaimLetterDetail.every(doc => acknowledgementOfClaimDocTypes.includes(doc.type ?? '')),
    respondentResponseDeadline: userCase?.respondentResponseDeadline,
  };
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

// Show a notification if there are any claimant responses that have not been viewed yet
export const shouldShowClaimantTribunalResponseReceived = (notifications: SendNotificationTypeItem[]): boolean => {
  return notifications?.some(notification => {
    const responses = notification.value.respondCollection;
    return responses?.some(
      response => response.value.from === Applicant.CLAIMANT && response.value.responseState !== HubLinkStatus.VIEWED
    );
  });
};

// Only show new respondent applications if there are applications that are not started yet
// notStartedYet applications can also be ones where the tribunal has asked the claimant for more information.
// Therefore, make sure also that there's a notStartedYet application with no requests for information
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

export const shouldShowRespondentAcknowledgement = (
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

  if (!respondentCollection) {
    return false;
  }
  return respondentCollection.every(res => {
    const assignedRep = repCollection?.find(rep => rep.respondentId === res.ccdId);
    if (assignedRep) {
      return assignedRep.hasMyHMCTSAccount === YesOrNo.YES;
    } else {
      return res.idamId !== undefined;
    }
  });
};

export enum StatusesInOrderOfUrgency {
  notStartedYet = 0,
  notViewedYet = 1,
  updated = 2,
  inProgress = 3,
  viewed = 4,
  waitingForTheTribunal = 5,
  stored = 6,
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

  return !(
    status === HubLinkStatus.WAITING_FOR_TRIBUNAL &&
    linkName !== HubLinkNames.RespondentApplications &&
    linkName !== HubLinkNames.RequestsAndApplications
  );
};

export const getAllClaimantApplications = (userCase: CaseWithId): GenericTseApplicationTypeItem[] => {
  return userCase.genericTseApplicationCollection?.filter(
    item => item.value.applicant === Applicant.CLAIMANT || item.value.applicant === Applicant.CLAIMANT_REP
  );
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

export const getHubLinksUrlMap = (isRespondentSystemUser: boolean, languageParam: string): Map<string, string> => {
  const baseUrls = {
    [languages.ENGLISH_URL_PARAMETER]: '',
    [languages.WELSH_URL_PARAMETER]: languages.WELSH_URL_PARAMETER,
  };
  return new Map<string, string>([
    [HubLinkNames.Et1ClaimForm, PageUrls.CLAIM_DETAILS + baseUrls[languageParam]],
    [HubLinkNames.HearingDetails, PageUrls.HEARING_DETAILS + baseUrls[languageParam]],
    [HubLinkNames.RespondentResponse, PageUrls.CITIZEN_HUB_DOCUMENT_RESPONSE_RESPONDENT + baseUrls[languageParam]],
    [HubLinkNames.ViewRespondentContactDetails, PageUrls.RESPONDENT_CONTACT_DETAILS + baseUrls[languageParam]],
    [HubLinkNames.ContactTribunal, PageUrls.CONTACT_THE_TRIBUNAL + baseUrls[languageParam]],
    [HubLinkNames.RequestsAndApplications, PageUrls.YOUR_APPLICATIONS + baseUrls[languageParam]],
    [HubLinkNames.RespondentApplications, PageUrls.RESPONDENT_APPLICATIONS + baseUrls[languageParam]],
    [HubLinkNames.TribunalOrders, PageUrls.NOTIFICATIONS + baseUrls[languageParam]],
    [HubLinkNames.TribunalJudgements, PageUrls.ALL_JUDGMENTS + baseUrls[languageParam]],
    [HubLinkNames.Documents, PageUrls.ALL_DOCUMENTS + baseUrls[languageParam]],
  ]);
};

export const getStoredPendingBannerList = (
  storedApps: GenericTseApplicationTypeItem[],
  apps: GenericTseApplicationTypeItem[],
  notifications: SendNotificationTypeItem[],
  languageParam: string
): StoreNotification[] => {
  const storeNotifications: StoreNotification[] = [];
  storeNotifications.push(...getStoredApplication(storedApps, languageParam));
  storeNotifications.push(...getStoredApplicationRespond(apps, languageParam));
  storeNotifications.push(...getStoredNotificationRespond(notifications, languageParam));
  return storeNotifications;
};

const getStoredApplication = (apps: GenericTseApplicationTypeItem[], languageParam: string): StoreNotification[] => {
  const storeNotifications: StoreNotification[] = [];
  for (const app of apps || []) {
    const storeNotification: StoreNotification = {
      viewUrl: PageUrls.STORED_TO_SUBMIT.replace(':appId', app.id) + languageParam,
    };
    storeNotifications.push(storeNotification);
  }
  return storeNotifications;
};

const getStoredApplicationRespond = (
  apps: GenericTseApplicationTypeItem[],
  languageParam: string
): StoreNotification[] => {
  const storeNotifications: StoreNotification[] = [];
  for (const app of apps || []) {
    if (app.value.respondStoredCollection) {
      app.value.respondStoredCollection.forEach(r =>
        storeNotifications.push({
          viewUrl:
            PageUrls.STORED_TO_SUBMIT_RESPONSE.replace(':appId', app.id).replace(':responseId', r.id) + languageParam,
        })
      );
    }
  }
  return storeNotifications;
};

const getStoredNotificationRespond = (
  items: SendNotificationTypeItem[],
  languageParam: string
): StoreNotification[] => {
  const storeNotifications: StoreNotification[] = [];
  for (const item of items || []) {
    if (item.value.respondStoredCollection) {
      item.value.respondStoredCollection.forEach(r =>
        storeNotifications.push({
          viewUrl:
            PageUrls.STORED_TO_SUBMIT_TRIBUNAL.replace(':orderId', item.id).replace(':responseId', r.id) +
            languageParam,
        })
      );
    }
  }
  return storeNotifications;
};

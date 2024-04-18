import { AdminNotifcation } from '../../definitions/adminNotification';
import { YesOrNo } from '../../definitions/case';
import {
  GenericTseApplicationTypeItem,
  TseRespondTypeItem,
} from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant, Parties } from '../../definitions/constants';
import { AnyRecord } from '../../definitions/util-types';

export const getApplicationsWithTribunalOrderOrRequest = (
  apps: GenericTseApplicationTypeItem[],
  translations: AnyRecord,
  languageParam: string
): AdminNotifcation[] => {
  const appsWithTribunalOrderOrRequest: AdminNotifcation[] = [];
  for (const app of apps || []) {
    const allRequestsFromAdmin: AdminNotifcation[] = getVisibleRequestFromAdmin(app, translations, languageParam);
    if (allRequestsFromAdmin.length) {
      for (const request of allRequestsFromAdmin) {
        appsWithTribunalOrderOrRequest.push(request);
      }
    }
  }
  return appsWithTribunalOrderOrRequest;
};

export const responseToTribunalRequired = (selectedApplication: GenericTseApplicationTypeItem): boolean => {
  return selectedApplication.value.claimantResponseRequired === YesOrNo.YES;
};

const getVisibleRequestFromAdmin = (
  app: GenericTseApplicationTypeItem,
  translations: AnyRecord,
  languageParam: string
): AdminNotifcation[] => {
  const adminNotifications: AdminNotifcation[] = [];
  if (!app.value.respondCollection?.length) {
    return adminNotifications;
  }
  for (const response of app.value.respondCollection) {
    if (isVisibleTribunalResponse(response, app.value.claimantResponseRequired)) {
      const adminNotification: AdminNotifcation = {
        appName: translations[app.value.type],
        enterResponseTitle: response.value.enterResponseTitle,
        responseId: response.id,
        appId: app.id,
        from: getNameText(app.value.applicant, translations),
        isResponseRequired: response.value.isResponseRequired,
        appUrl: getAppUrl(app.value.applicant, app.id, languageParam),
      };
      adminNotifications.push(adminNotification);
      return adminNotifications;
    }
  }
  return adminNotifications;
};

const isVisibleTribunalResponse = (response: TseRespondTypeItem, claimantResponseRequired: string) => {
  if (claimantResponseRequired === YesOrNo.YES && response.value.isResponseRequired === YesOrNo.YES) {
    return isSentToClaimantByTribunal(response);
  }
  if (response.value.isResponseRequired !== YesOrNo.YES && response.value.viewedByClaimant !== YesOrNo.YES) {
    return isSentToClaimantByTribunal(response);
  }
};

export const isSentToClaimantByTribunal = (response: TseRespondTypeItem): boolean => {
  return (
    response.value.from === Applicant.ADMIN &&
    (response.value.selectPartyNotify === Parties.CLAIMANT_ONLY ||
      // EW has 'Both parties'. Scottish had 'Both Parties'
      response.value.selectPartyNotify.toLowerCase() === Parties.BOTH_PARTIES.toLowerCase())
  );
};

const getNameText = (applicant: string, translations: AnyRecord): string => {
  return applicant === Applicant.CLAIMANT ? translations.your : translations.theRespondent;
};

const getAppUrl = (applicant: string, appId: string, languageParam: string) => {
  return applicant === Applicant.CLAIMANT
    ? `/application-details/${appId}${languageParam}`
    : `/respondent-application-details/${appId}${languageParam}`;
};

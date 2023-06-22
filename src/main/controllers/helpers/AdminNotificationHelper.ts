import { AdminNotifcation } from '../../definitions/adminNotification';
import { GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant, Parties } from '../../definitions/constants';
import { AnyRecord } from '../../definitions/util-types';

export const getApplicationsWithTribunalOrderOrRequest = (
  apps: GenericTseApplicationTypeItem[],
  translations: AnyRecord,
  languageParam: string
): AdminNotifcation[] => {
  const appsWithTribunalOrderOrRequest: AdminNotifcation[] = [];
  if (apps) {
    for (const app of apps) {
      const request = getVisibleRequestFromAdmin(app, translations, languageParam);
      if (request) {
        appsWithTribunalOrderOrRequest.push(request);
      }
    }
    return appsWithTribunalOrderOrRequest;
  }
};

export const responseRequired = (adminRequest: AdminNotifcation): boolean => {
  return adminRequest?.isResponseRequired === 'Yes';
};

export const getVisibleRequestFromAdmin = (
  app: GenericTseApplicationTypeItem,
  translations: AnyRecord,
  languageParam: string
): AdminNotifcation => {
  if (app.value.respondCollection?.length) {
    for (const response of app.value.respondCollection) {
      if (
        response.value.from === Applicant.ADMIN &&
        (response.value.selectPartyNotify === Parties.CLAIMANT_ONLY ||
          response.value.selectPartyNotify === Parties.BOTH_PARTIES)
      ) {
        const adminNotification: AdminNotifcation = {
          appName: app.value.type,
          enterResponseTitle: response.value.enterResponseTitle,
          responseId: response.id,
          appId: app.id,
          from: getNameText(app.value.applicant, translations),
          isResponseRequired: response.value.isResponseRequired,
          appUrl: getAppUrl(app.value.applicant, app.id, languageParam),
        };
        // Only return one tribunal request at a time
        return adminNotification;
      }
    }
  }
};

const getNameText = (applicant: string, translations: AnyRecord): string => {
  return applicant === Applicant.CLAIMANT ? translations.your : translations.theRespondent;
};

const getAppUrl = (applicant: string, appId: string, languageParam: string) => {
  return applicant === Applicant.CLAIMANT
    ? `/application-details/${appId}${languageParam}`
    : `/respondent-application-details/${appId}${languageParam}`;
};

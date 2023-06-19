import { AdminNotifcation } from '../../definitions/adminNotification';
import { CaseWithId } from '../../definitions/case';
import { GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { AnyRecord } from '../../definitions/util-types';

export const getApplicationsWithTribunalOrderOrRequest = (
  userCase: CaseWithId,
  translations: AnyRecord,
  languageParam: string
): AdminNotifcation[] => {
  const apps = userCase?.genericTseApplicationCollection;
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

const getNameText = (applicant: string, translations: AnyRecord): string => {
  return applicant === 'Claimant' ? translations.your : translations.theRespondent;
};

const getAppUrl = (applicant: string, appId: string, languageParam: string) => {
  return applicant === 'Claimant'
    ? `/application-details/${appId}${languageParam}`
    : `/respondent-application-details/${appId}${languageParam}`;
};

export const responseRequired = (adminRequest: AdminNotifcation): boolean => {
  if (adminRequest?.isResponseRequired === 'Yes') {
    return true;
  } else {
    return false;
  }
};

export const getVisibleRequestFromAdmin = (
  app: GenericTseApplicationTypeItem,
  translations: AnyRecord,
  languageParam: string
): AdminNotifcation => {
  if (app.value.respondCollection?.length > 0) {
    for (const response of app.value.respondCollection) {
      if (
        response.value.from === 'Admin' &&
        (response.value.selectPartyNotify === 'Claimant only' || response.value.selectPartyNotify === 'Both parties')
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

import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId } from '../../definitions/case';
import { PageUrls } from '../../definitions/constants';

import { checkIfRespondentIsSystemUser } from './CitizenHubHelper';
import { setUrlLanguage } from './LanguageHelper';

export const getCancelLink = (req: AppRequest): string => {
  const userCase = req.session?.userCase;
  return setUrlLanguage(req, PageUrls.CITIZEN_HUB.replace(':caseId', userCase.id));
};

export const getAppDetailsLink = (appId: string, languageParam: string): string => {
  return PageUrls.APPLICATION_DETAILS.replace(':appId', appId) + languageParam;
};

export const getSendNotificationDetailsLink = (orderId: string, languageParam: string): string => {
  return PageUrls.NOTIFICATION_DETAILS.replace(':orderId', orderId) + languageParam;
};

export const copyToOtherPartyRedirectUrl = (userCase: CaseWithId): string => {
  const isRespondentSystemUser = checkIfRespondentIsSystemUser(userCase);
  return isRespondentSystemUser ? PageUrls.COPY_TO_OTHER_PARTY : PageUrls.COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER;
};

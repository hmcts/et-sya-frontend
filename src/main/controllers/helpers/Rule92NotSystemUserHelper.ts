import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId, appStatus } from '../../definitions/case';
import { GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant, PageUrls } from '../../definitions/constants';

import { checkIfRespondentIsSystemUser } from './CitizenHubHelper';
import { setUrlLanguage } from './LanguageHelper';

export const copyToOtherPartyRedirectUrl = (userCase: CaseWithId): string => {
  const isRespondentSystemUser = checkIfRespondentIsSystemUser(userCase);
  return isRespondentSystemUser ? PageUrls.COPY_TO_OTHER_PARTY : PageUrls.COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER;
};

export const getCancelLink = (req: AppRequest): string => {
  const userCase = req.session?.userCase;
  return setUrlLanguage(req, PageUrls.CITIZEN_HUB.replace(':caseId', userCase.id));
};

export const getAppDetailsLink = (appId: string, languageParam: string): string => {
  return PageUrls.APPLICATION_DETAILS.replace(':appId', appId) + languageParam;
};

export const getStoredPendingApplicationLinks = (
  apps: GenericTseApplicationTypeItem[],
  languageParam: string
): string[] => {
  return apps
    ?.filter(app => app.value.status === appStatus.STORED)
    .map(app => getStoredToSubmitLink(app.id, languageParam));
};

const getStoredToSubmitLink = (appId: string, languageParam: string): string => {
  return PageUrls.STORED_TO_SUBMIT.replace(':appId', appId) + languageParam;
};

export const getLatestApplication = (items: GenericTseApplicationTypeItem[]): GenericTseApplicationTypeItem => {
  const filteredItem = items?.filter(it => it.value.applicant === Applicant.CLAIMANT);
  return filteredItem[filteredItem.length - 1];
};

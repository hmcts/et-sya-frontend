import { Response } from 'express';

import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId } from '../../definitions/case';
import { GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { ErrorPages, PageUrls } from '../../definitions/constants';
import { Logger } from '../../logger';

import { checkIfRespondentIsSystemUser } from './CitizenHubHelper';
import { setUrlLanguage } from './LanguageHelper';
import { getLanguageParam } from './RouterHelpers';

export const getCancelLink = (req: AppRequest): string => {
  const userCase = req.session?.userCase;
  return setUrlLanguage(req, PageUrls.CITIZEN_HUB.replace(':caseId', userCase.id));
};

export const getAppDetailsLink = (appId: string, languageParam: string): string => {
  return PageUrls.APPLICATION_DETAILS.replace(':appId', appId) + languageParam;
};

export const getSendNotificationDetailsLink = (orderId: string, languageParam: string): string => {
  return PageUrls.TRIBUNAL_ORDER_OR_REQUEST_DETAILS.replace(':orderId', orderId) + languageParam;
};

export const copyToOtherPartyRedirectUrl = (userCase: CaseWithId): string => {
  const isRespondentSystemUser = checkIfRespondentIsSystemUser(userCase);
  return isRespondentSystemUser ? PageUrls.COPY_TO_OTHER_PARTY : PageUrls.COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER;
};

export const redirectErrorPageIfAppUndefined = (
  genericTseApplicationTypeItem: GenericTseApplicationTypeItem,
  req: AppRequest,
  res: Response,
  logger: Logger
): void => {
  if (!genericTseApplicationTypeItem) {
    logger.error('Selected application not found');
    return res.redirect(ErrorPages.NOT_FOUND + getLanguageParam(req.url));
  }
};

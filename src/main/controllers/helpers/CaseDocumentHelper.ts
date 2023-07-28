import { LoggerInstance } from 'winston';

import { AppRequest } from '../../definitions/appRequest';
import { ET3_FORM } from '../../definitions/constants';
import { DocumentDetail } from '../../definitions/definition';
import { HubLinkNames, HubLinkStatus } from '../../definitions/hub';

import { handleUpdateHubLinksStatuses } from './CaseHelpers';

export const setRespondentResponseHubLinkStatus = async (
  docDetails: DocumentDetail,
  req: AppRequest,
  logger: LoggerInstance
): Promise<void> => {
  if (docDetails.type === ET3_FORM) {
    req.session.userCase.hubLinksStatuses[HubLinkNames.RespondentResponse] = HubLinkStatus.VIEWED;
    await handleUpdateHubLinksStatuses(req, logger);
  }
};

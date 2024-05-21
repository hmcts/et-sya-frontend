import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { ErrorPages, PageUrls } from '../definitions/constants';
import { HubLinkNames, HubLinkStatus } from '../definitions/hub';
import { getLogger } from '../logger';

import { addResponseSendNotification, clearTseFields, handleUpdateHubLinksStatuses } from './helpers/CaseHelpers';

const logger = getLogger('TribunalResponseSubmitController');
export default class TribunalResponseSubmitController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    try {
      const userCase = req.session?.userCase;
      userCase.hubLinksStatuses[HubLinkNames.TribunalOrders] = HubLinkStatus.IN_PROGRESS;
      await handleUpdateHubLinksStatuses(req, logger);
      await addResponseSendNotification(req, logger);
      userCase.rule92state = userCase.copyToOtherPartyYesOrNo && userCase.copyToOtherPartyYesOrNo === YesOrNo.YES;
      clearTseFields(userCase);
    } catch (error) {
      logger.error(error.message);
      return res.redirect(ErrorPages.NOT_FOUND);
    }
    return res.redirect(PageUrls.TRIBUNAL_RESPONSE_COMPLETED);
  };
}

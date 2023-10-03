import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { ErrorPages, PageUrls } from '../definitions/constants';
import { HubLinkNames, HubLinkStatus } from '../definitions/hub';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

import { clearTseFields } from './helpers/CaseHelpers';

const logger = getLogger('TribunalResponseStoreController');
export default class TribunalResponseStoreController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session?.userCase;

    try {
      userCase.hubLinksStatuses[HubLinkNames.TribunalOrders] = HubLinkStatus.IN_PROGRESS;
      await getCaseApi(req.session.user?.accessToken).updateHubLinksStatuses(req.session.userCase);
    } catch (error) {
      logger.error(error.message);
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    try {
      await getCaseApi(req.session.user?.accessToken).storeResponseSendNotification(req.session.userCase);
    } catch (error) {
      logger.error(error.message);
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    try {
      userCase.rule92state = userCase.copyToOtherPartyYesOrNo && userCase.copyToOtherPartyYesOrNo === YesOrNo.YES;
      clearTseFields(userCase);
    } catch (error) {
      logger.error(error.message);
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    return res.redirect(PageUrls.STORED_APPLICATION_CONFIRMATION);
  };
}

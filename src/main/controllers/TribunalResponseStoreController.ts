import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { ErrorPages, PageUrls, ResponseStatus } from '../definitions/constants';
import { HubLinkNames, HubLinkStatus } from '../definitions/hub';
import { fromApiFormat } from '../helper/ApiFormatter';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

import { clearTseFields } from './helpers/CaseHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('TribunalResponseStoreController');
export default class TribunalResponseStoreController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const languageParam = getLanguageParam(req.url);
    const userCase = req.session?.userCase;

    try {
      userCase.hubLinksStatuses[HubLinkNames.TribunalOrders] = HubLinkStatus.STORED;
      await getCaseApi(req.session.user?.accessToken).updateHubLinksStatuses(req.session.userCase);
    } catch (error) {
      logger.error(error.message);
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }

    try {
      req.session.userCase.responseStatus = ResponseStatus.STORED;
      await getCaseApi(req.session.user?.accessToken).storeResponseSendNotification(req.session.userCase);
    } catch (error) {
      logger.error(error.message);
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }

    let orderId;
    try {
      orderId = userCase.selectedRequestOrOrder.id;
      userCase.rule92state = userCase.copyToOtherPartyYesOrNo && userCase.copyToOtherPartyYesOrNo === YesOrNo.YES;
      clearTseFields(userCase);
    } catch (error) {
      logger.error(error.message);
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }

    try {
      req.session.userCase = fromApiFormat(
        (await getCaseApi(req.session.user?.accessToken).getUserCase(req.session.userCase.id)).data
      );
    } catch (error) {
      logger.error(error.message);
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }

    return res.redirect(PageUrls.STORED_RESPONSE_TRIBUNAL_CONFIRMATION.replace(':orderId', orderId) + languageParam);
  };
}

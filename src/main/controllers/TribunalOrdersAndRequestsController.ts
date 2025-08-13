import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { SendNotificationTypeItem } from '../definitions/complexTypes/sendNotificationTypeItem';
import { TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { fromApiFormat } from '../helper/ApiFormatter';
import { getLogger } from '../logger';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';
import { getCaseApi } from '../services/CaseService';

import { getPageContent } from './helpers/FormHelpers';
import { getSendNotifications } from './helpers/TribunalOrderOrRequestsHelper';

const logger = getLogger('TribunalOrdersAndRequestsController');
export class TribunalOrdersAndRequestsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const welshEnabled = await getFlagValue('welsh-language', null);

    try {
      req.session.userCase = fromApiFormat(
        (await getCaseApi(req.session.user?.accessToken).getUserCase(req.session.userCase.id)).data
      );

      const notifications: SendNotificationTypeItem[] = await getSendNotifications(req);

      const content = getPageContent(req, <FormContent>{}, [
        TranslationKeys.SIDEBAR_CONTACT_US,
        TranslationKeys.COMMON,
        TranslationKeys.NOTIFICATIONS,
      ]);
      res.render(TranslationKeys.NOTIFICATIONS, {
        ...content,
        notifications,
        welshEnabled,
      });
    } catch (error) {
      logger.error(error.message);
      return res.redirect('/not-found');
    }
  };
}

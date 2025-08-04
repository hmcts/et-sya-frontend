import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { SendNotificationTypeItem } from '../definitions/complexTypes/sendNotificationTypeItem';
import { TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { fromApiFormat } from '../helper/ApiFormatter';
import { getLogger } from '../logger';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';
import { getCaseApi } from '../services/CaseService';

import { getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';
import { getSendNotifications } from './helpers/TribunalOrderOrRequestDetailsHelper';

const logger = getLogger('TribunalOrdersAndRequestsController');
export class TribunalOrdersAndRequestsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const welshEnabled = await getFlagValue('welsh-language', null);
    const languageParam = getLanguageParam(req.url);

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
      ...req.t(TranslationKeys.NOTIFICATIONS, { returnObjects: true }),
    };

    try {
      req.session.userCase = fromApiFormat(
        (await getCaseApi(req.session.user?.accessToken).getUserCase(req.session.userCase.id)).data
      );

      const notifications: SendNotificationTypeItem[] = await getSendNotifications(
        req.session.userCase?.sendNotificationCollection,
        translations,
        languageParam
      );

      const content = getPageContent(req, <FormContent>{}, [
        TranslationKeys.SIDEBAR_CONTACT_US,
        TranslationKeys.COMMON,
        TranslationKeys.NOTIFICATIONS,
      ]);
      res.render(TranslationKeys.NOTIFICATIONS, {
        ...content,
        notifications,
        translations,
        languageParam,
        welshEnabled,
      });
    } catch (error) {
      logger.error(error.message);
      return res.redirect('/not-found');
    }
  };
}

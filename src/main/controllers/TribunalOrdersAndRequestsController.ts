import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { Parties, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { getPageContent } from './helpers/FormHelpers';
import { filterSendNotifications } from './helpers/TribunalOrderOrRequestHelper';

export class TribunalOrdersAndRequestsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session?.userCase;
    const notifications = filterSendNotifications(userCase?.sendNotificationCollection).filter(
      it => it.value.sendNotificationNotify !== Parties.RESPONDENT_ONLY
    );

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
      ...req.t(TranslationKeys.TRIBUNAL_ORDERS_AND_REQUESTS, { returnObjects: true }),
    };

    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.COMMON,
      TranslationKeys.TRIBUNAL_ORDERS_AND_REQUESTS,
    ]);
    res.render(TranslationKeys.TRIBUNAL_ORDERS_AND_REQUESTS, {
      ...content,
      notifications,
      translations,
    });
  };
}

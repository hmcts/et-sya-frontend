import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { Parties, ResponseRequired, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { getPageContent } from './helpers/FormHelpers';
import { filterNotificationsWithRequestsOrOrders } from './helpers/RespondentOrderOrRequestHelper';

export class RespondentOrdersAndRequestsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session?.userCase;

    const notifications = filterNotificationsWithRequestsOrOrders(userCase?.sendNotificationCollection).filter(
      it =>
        it.value.sendNotificationResponseTribunal === ResponseRequired.YES &&
        it.value.sendNotificationNotify !== Parties.RESPONDENT_ONLY
    );
    const translations: AnyRecord = {
      ...req.t(TranslationKeys.RESPONDENT_ORDERS_AND_REQUESTS, { returnObjects: true }),
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
    };

    const content = getPageContent(req, <FormContent>{}, [TranslationKeys.RESPONDENT_ORDERS_AND_REQUESTS]);
    res.render(TranslationKeys.RESPONDENT_ORDERS_AND_REQUESTS, {
      ...content,
      notifications,
      translations,
    });
  };
}

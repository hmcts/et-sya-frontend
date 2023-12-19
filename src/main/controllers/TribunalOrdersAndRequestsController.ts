import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { FEATURE_FLAGS, NotificationSubjects, Parties, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

import { getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

export class TribunalOrdersAndRequestsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const welshEnabled = await getFlagValue('welsh-language', null);
    const userCase = req.session?.userCase;
    const languageParam = getLanguageParam(req.url);
    const eccFlag = await getFlagValue(FEATURE_FLAGS.ECC, null);

    let notifications;
    if (eccFlag) {
      notifications = userCase?.sendNotificationCollection.filter(
        it =>
          (it.value.sendNotificationNotify !== Parties.RESPONDENT_ONLY &&
            it.value.sendNotificationSubjectString?.includes(NotificationSubjects.ORDER_OR_REQUEST)) ||
          it.value.sendNotificationSubjectString?.includes(NotificationSubjects.ECC)
      );
    } else {
      notifications = userCase?.sendNotificationCollection.filter(
        it =>
          it.value.sendNotificationNotify !== Parties.RESPONDENT_ONLY &&
          it.value.sendNotificationSubjectString?.includes(NotificationSubjects.ORDER_OR_REQUEST) &&
          !it.value.sendNotificationSubjectString?.includes(NotificationSubjects.ECC)
      );
    }

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
      ...req.t(TranslationKeys.TRIBUNAL_ORDERS_AND_REQUESTS, { returnObjects: true }),
    };
    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.COMMON,
      TranslationKeys.TRIBUNAL_ORDERS_AND_REQUESTS,
    ]);
    res.render(TranslationKeys.TRIBUNAL_ORDERS_AND_REQUESTS, {
      ...content,
      notifications,
      translations,
      languageParam,
      welshEnabled,
    });
  };
}

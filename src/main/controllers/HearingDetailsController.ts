import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

import { updateHearingNotificationState } from './helpers/CaseHelpers';
import { getHearingCollection } from './helpers/HearingHelpers';

const logger = getLogger('HearingDetailsController');

export default class HearingDetailsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session.userCase;

    try {
      await updateHearingNotificationState(req, logger);
    } catch (error) {
      logger.info(error.message);
    }

    const welshEnabled = await getFlagValue('welsh-language', null);

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
    };

    res.render(TranslationKeys.HEARING_DETAILS, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
      ...req.t(TranslationKeys.HEARING_DETAILS, { returnObjects: true }),
      hearingDetailsCollection: getHearingCollection(
        userCase.hearingCollection,
        userCase.sendNotificationCollection,
        translations
      ),
      welshEnabled,
    });
  };
}

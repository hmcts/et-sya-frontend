import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

export default class HearingDetailsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session.userCase;

    const welshEnabled = await getFlagValue('welsh-language', null);

    res.render(TranslationKeys.HEARING_DETAILS, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
      ...req.t(TranslationKeys.HEARING_DETAILS, { returnObjects: true }),
      hearingCollection: userCase.hearingCollection,
      welshEnabled,
    });
  };
}
import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';

export default class CitizenHubAcknowledgementController {
  public get = (req: AppRequest, res: Response): void => {
    const { userCase } = req.session;

    res.render(TranslationKeys.CITIZEN_HUB_ACKNOWLEDGEMENT, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
      PageUrls,
      userCase,
      hideContactUs: true,
    });
  };
}

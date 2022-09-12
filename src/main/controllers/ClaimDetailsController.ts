import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';

export default class ClaimDetailsController {
  public get = (req: AppRequest, res: Response): void => {
    res.render(TranslationKeys.CLAIM_DETAILS, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CLAIM_DETAILS, { returnObjects: true }),
      PageUrls,
      userCase: req.session?.userCase,
    });
  };
}

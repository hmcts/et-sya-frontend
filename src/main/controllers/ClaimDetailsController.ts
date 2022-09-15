import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';

import { getEt1DetailsFormatted } from './helpers/Et1FieldsFormatter';

export default class ClaimDetailsController {
  public get = (req: AppRequest, res: Response): void => {
    res.render(TranslationKeys.CLAIM_DETAILS, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.ET1_FIELD_NAMES, { returnObjects: true }),
      ...req.t(TranslationKeys.CLAIM_DETAILS, { returnObjects: true }),
      PageUrls,
      userCase: req.session?.userCase,
      et1: getEt1DetailsFormatted(req.session?.userCase),
    });
  };
}

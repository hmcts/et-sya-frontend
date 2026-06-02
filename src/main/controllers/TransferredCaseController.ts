import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';

export default class TransferredCaseController {
  public get(req: AppRequest, res: Response): void {
    res.render(TranslationKeys.TRANSFERRED_CASE, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
      ...req.t(TranslationKeys.TRANSFERRED_CASE, { returnObjects: true }),
    });
  }
}

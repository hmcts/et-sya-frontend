import { Request, Response } from 'express';

import { PageUrls, TranslationKeys } from '../definitions/constants';

export default class ChecklistController {
  public get(req: Request, res: Response): void {
    res.render(TranslationKeys.CHECKLIST, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CHECKLIST, { returnObjects: true }),
      PageUrls,
    });
  }
}

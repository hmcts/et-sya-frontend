import { Request, Response } from 'express';

import { PageUrls, TranslationKeys } from '../definitions/constants';

export default class AccessibilityStatementController {
  public get(req: Request, res: Response): void {
    res.render(TranslationKeys.ACCESSIBILITY_STATEMENT, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.ACCESSIBILITY_STATEMENT, { returnObjects: true }),
      PageUrls,
    });
  }
}

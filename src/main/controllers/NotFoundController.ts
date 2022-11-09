import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { getLogger } from '../logger';

const logger = getLogger('NotFoundController');
export default class NotFoundController {
  public get = (req: AppRequest, res: Response): void => {
    logger.info('Not found page');
    res.render(TranslationKeys.NOT_FOUND, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.NOT_FOUND, { returnObjects: true }),
    });
  };
}

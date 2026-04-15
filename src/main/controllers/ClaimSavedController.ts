import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';

import { getLanguageParam } from './helpers/RouterHelpers';

export default class ClaimSavedController {
  public get(req: AppRequest, res: Response): void {
    res.render('claim-saved', {
      ...req.t('claim-saved', { returnObjects: true }),
      PageUrls,
      languageParam: getLanguageParam(req.url),
    });
  }
}

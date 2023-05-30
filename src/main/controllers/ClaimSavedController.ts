import { AppRequest } from '../definitions/appRequest';
import { AuthUrls, PageUrls } from '../definitions/constants';

import { setUrlLanguage } from './helpers/LanguageHelper';
import { getLanguageParam } from './helpers/RouterHelpers';

import { Response } from 'express';

export default class ClaimSavedController {
  public get(req: AppRequest, res: Response): void {
    const redirectUrl = setUrlLanguage(req, PageUrls.RETURN_TO_EXISTING);
    res.render('claim-saved', {
      ...req.t('claim-saved', { returnObjects: true }),
      redirectUrl,
      AuthUrls,
      languageParam: getLanguageParam(req.url),
    });
  }
}

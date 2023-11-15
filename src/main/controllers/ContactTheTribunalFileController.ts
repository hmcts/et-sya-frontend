import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';
import { getLogger } from '../logger';

import { getLanguageParam, returnSafeRedirectUrl } from './helpers/RouterHelpers';

const logger = getLogger('ContactTheTribunalFileController');

export default class ContactTheTribunalFileController {
  public get = (req: AppRequest, res: Response): void => {
    req.session.userCase.contactApplicationFile = undefined;
    const redirectUrl =
      PageUrls.TRIBUNAL_CONTACT_SELECTED.replace(':selectedOption', req.params.application) + getLanguageParam(req.url);
    res.redirect(returnSafeRedirectUrl(req, redirectUrl, logger));
  };
}

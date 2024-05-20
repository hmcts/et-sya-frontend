import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';
import { getLogger } from '../logger';

import { getLanguageParam, returnSafeRedirectUrl } from './helpers/RouterHelpers';

const logger = getLogger('HearingDocumentFileController');

export default class HearingDocumentFileController {
  public get = (req: AppRequest, res: Response): void => {
    req.session.userCase.hearingDocument = undefined;
    const redirectUrl =
      PageUrls.HEARING_DOCUMENT_UPLOAD.replace(':appId', req.params.appId) + getLanguageParam(req.url);
    res.redirect(returnSafeRedirectUrl(req, redirectUrl, logger));
  };
}

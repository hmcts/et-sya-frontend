import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';

import { getLanguageParam } from './helpers/RouterHelpers';

export default class HearingDocumentFileController {
  public get = (req: AppRequest, res: Response): void => {
    req.session.userCase.hearingDocument = undefined;
    const url = PageUrls.HEARING_DOCUMENT_UPLOAD.replace(':appId', req.params.appId) + getLanguageParam(req.url);
    res.redirect(url);
  };
}

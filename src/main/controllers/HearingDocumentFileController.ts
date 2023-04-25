import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';

import { getLanguageParam } from './helpers/RouterHelpers';

export default class HearingDocumentFileController {
  public get = (req: AppRequest, res: Response): void => {
    console.log('setting hearing doc to undefined');
    req.session.userCase.hearingDocument = undefined;
    const url = PageUrls.UPLOAD_YOUR_FILE.replace(':appId', req.params.appId) + getLanguageParam(req.url);
    console.log('redirecting url is ', url);
    res.redirect(url);
  };
}

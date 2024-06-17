import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, PageUrls } from '../definitions/constants';
import { getLogger } from '../logger';

import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('HearingDocumentFileController');

export default class HearingDocumentFileController {
  public get = (req: AppRequest, res: Response): void => {
    req.session.userCase.hearingDocument = undefined;

    const foundHearing = req.session.userCase.hearingCollection?.find(hearing => hearing.id === req.params.hearingId);
    if (!foundHearing) {
      logger.error('Hearing not found');
      return res.redirect(ErrorPages.NOT_FOUND + getLanguageParam(req.url));
    }
    const url = PageUrls.HEARING_DOCUMENT_UPLOAD.replace(':hearingId', foundHearing.id) + getLanguageParam(req.url);
    res.redirect(url);
  };
}

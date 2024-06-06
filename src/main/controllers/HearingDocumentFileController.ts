import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, PageUrls } from '../definitions/constants';
import { getLogger } from '../logger';

import { findSelectedGenericTseApplication } from './helpers/DocumentHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('HearingDocumentFileController');

export default class HearingDocumentFileController {
  public get = (req: AppRequest, res: Response): void => {
    req.session.userCase.hearingDocument = undefined;

    const selectedApplication = findSelectedGenericTseApplication(
      req.session.userCase.genericTseApplicationCollection,
      req.params.appId
    );
    if (!selectedApplication) {
      logger.error('Selected application not found');
      return res.redirect(ErrorPages.NOT_FOUND + getLanguageParam(req.url));
    }
    const url = PageUrls.HEARING_DOCUMENT_UPLOAD.replace(':appId', selectedApplication.id) + getLanguageParam(req.url);
    res.redirect(url);
  };
}

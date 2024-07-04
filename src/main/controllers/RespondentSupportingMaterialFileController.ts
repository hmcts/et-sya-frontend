import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, PageUrls } from '../definitions/constants';
import { getLogger } from '../logger';

import { findSelectedGenericTseApplication } from './helpers/DocumentHelpers';
import { getLanguageParam, returnSafeRedirectUrl } from './helpers/RouterHelpers';

const logger = getLogger('RespondentSupportingMaterialFileController');

export default class RespondentSupportingMaterialFileController {
  public get = (req: AppRequest, res: Response): void => {
    req.session.userCase.supportingMaterialFile = undefined;

    const selectedApplication = findSelectedGenericTseApplication(
      req.session.userCase.genericTseApplicationCollection,
      req.params.appId
    );
    if (selectedApplication === undefined) {
      logger.error('Selected application not found');
      return res.redirect(ErrorPages.NOT_FOUND + getLanguageParam(req.url));
    }

    const redirectUrl =
      PageUrls.RESPONDENT_SUPPORTING_MATERIAL.replace(':appId', selectedApplication.id) + getLanguageParam(req.url);
    return res.redirect(returnSafeRedirectUrl(req, redirectUrl, logger));
  };
}

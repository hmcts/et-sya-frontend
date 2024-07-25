import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, PageUrls } from '../definitions/constants';
import { getLogger } from '../logger';

import { setUrlLanguageFromSessionLanguage } from './helpers/LanguageHelper';
import { findSelectedParamId } from './helpers/RespondentSupportingMaterialHelper';
import { getLanguageParam, returnSafeRedirectUrl } from './helpers/RouterHelpers';

const logger = getLogger('RespondentSupportingMaterialFileController');

export default class RespondentSupportingMaterialFileController {
  public get = (req: AppRequest, res: Response): void => {
    req.session.userCase.supportingMaterialFile = undefined;

    const selectedParamId = findSelectedParamId(req.session.userCase, req.params.appId);
    if (selectedParamId === undefined) {
      logger.error('Selected param id not found');
      return res.redirect(setUrlLanguageFromSessionLanguage(req, ErrorPages.NOT_FOUND));
    }

    const redirectUrl =
      PageUrls.RESPONDENT_SUPPORTING_MATERIAL.replace(':appId', selectedParamId) + getLanguageParam(req.url);
    return res.redirect(returnSafeRedirectUrl(req, redirectUrl, logger));
  };
}

import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';
import { getLogger } from '../logger';

import { getLanguageParam, returnSafeRedirectUrl } from './helpers/RouterHelpers';

const logger = getLogger('RespondentSupportingMaterialFileController');

export default class RespondentSupportingMaterialFileController {
  public get = (req: AppRequest, res: Response): void => {
    req.session.userCase.supportingMaterialFile = undefined;
    const redirectUrl =
      PageUrls.RESPONDENT_SUPPORTING_MATERIAL.replace(':appId', req.params.appId) + getLanguageParam(req.url);
    return res.redirect(returnSafeRedirectUrl(req, redirectUrl, logger));
  };
}

import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';

import { getLanguageParam } from './helpers/RouterHelpers';

export default class RespondentSupportingMaterialFileController {
  public get = (req: AppRequest, res: Response): void => {
    req.session.userCase.supportingMaterialFile = undefined;
    res.redirect(
      PageUrls.RESPONDENT_SUPPORTING_MATERIAL.replace(':appId', req.params.appId) + getLanguageParam(req.url)
    );
  };
}

import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';

import { setUrlLanguage } from './helpers/LanguageHelper';
import { getCancelLink } from './helpers/LinkHelpers';

export default class StoredToSubmitCompleteController {
  public get(req: AppRequest, res: Response): void {
    res.render(TranslationKeys.APPLICATION_COMPLETE, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.APPLICATION_COMPLETE, { returnObjects: true }),
      applicationDate: '',
      rule92: YesOrNo.NO,
      redirectUrl: getCancelLink(req),
      yourApplicationsUrl: setUrlLanguage(req, PageUrls.GROUP_CLAIM_REQUESTS_AND_APPLICATIONS),
    });
  }
}

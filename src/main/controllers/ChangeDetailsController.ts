import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { InterceptPaths, PageUrls } from '../definitions/constants';

import { setChangeAnswersUrlLanguage, setCheckAnswersLanguage } from './helpers/LanguageHelper';

export default class ChangeDetailsController {
  public get = (req: AppRequest, res: Response): void => {
    let redirectUrl = req.url;
    if (req.query.redirect === 'answers') {
      redirectUrl = setChangeAnswersUrlLanguage(req, redirectUrl);
      redirectUrl = req.url.replace(InterceptPaths.ANSWERS_CHANGE, redirectUrl);
      req.session.returnUrl = setCheckAnswersLanguage(req, PageUrls.CHECK_ANSWERS);
    } else if (req.query.redirect === 'respondent') {
      redirectUrl = setChangeAnswersUrlLanguage(req, redirectUrl);
      redirectUrl = req.url.replace(InterceptPaths.RESPONDENT_CHANGE, redirectUrl);
      req.session.returnUrl = setCheckAnswersLanguage(req, PageUrls.RESPONDENT_DETAILS_CHECK);
    }
    return res.redirect(redirectUrl);
  };
}

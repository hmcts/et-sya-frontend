import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, InterceptPaths, PageUrls } from '../definitions/constants';

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
    } else {
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    const ValidUrls = Object.values(PageUrls);
    for (const url of ValidUrls) {
      const welshUrl = url + '/?lng=cy';
      const englishUrl = url + '/?lng=en';
      if (redirectUrl === url) {
        return res.redirect(url);
      } else if (redirectUrl === welshUrl) {
        return res.redirect(welshUrl);
      } else if (redirectUrl === englishUrl) {
        return res.redirect(englishUrl);
      }
    }
    return res.redirect(ErrorPages.NOT_FOUND);
  };
}

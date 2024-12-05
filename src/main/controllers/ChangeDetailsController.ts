import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, InterceptPaths, PageUrls } from '../definitions/constants';

import { setChangeAnswersUrlLanguage, setCheckAnswersLanguage } from './helpers/LanguageHelper';
import { ValidRespondentUrls } from './helpers/RespondentHelpers';
import { returnValidUrl } from './helpers/RouterHelpers';

export default class ChangeDetailsController {
  public get = (req: AppRequest, res: Response): void => {
    let redirectUrl;
    const languageParam = setChangeAnswersUrlLanguage(req);

    // Set the i18next cookie with HttpOnly flag
    res.cookie('i18next', languageParam, {
      httpOnly: true, // Ensures the cookie is not accessible via JavaScript
      secure: true, // Ensures the cookie is only sent over HTTPS
      sameSite: 'strict', // Helps prevent CSRF attacks
    });
    if (req.query.redirect === 'answers') {
      redirectUrl = req.url.replace(InterceptPaths.ANSWERS_CHANGE, languageParam);
      req.session.returnUrl = setCheckAnswersLanguage(req, PageUrls.CHECK_ANSWERS);
    } else if (req.query.redirect === 'respondent') {
      redirectUrl = req.url.replace(InterceptPaths.RESPONDENT_CHANGE, languageParam);
      req.session.returnUrl = setCheckAnswersLanguage(req, PageUrls.RESPONDENT_DETAILS_CHECK);
    } else {
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    const respondentIndex = redirectUrl.indexOf('/respondent/');
    if (respondentIndex === -1) {
      const ValidRedirects = Object.values(PageUrls);
      return res.redirect(returnValidUrl(redirectUrl, ValidRedirects));
    } else {
      const ValidRespondentRedirects = Object.values(ValidRespondentUrls);
      return res.redirect(returnValidUrl(redirectUrl, ValidRespondentRedirects));
    }
  };
}

import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, InterceptPaths, PageUrls } from '../definitions/constants';

import { setChangeAnswersUrlLanguage, setCheckAnswersLanguage } from './helpers/LanguageHelper';
import { ValidRespondentUrls } from './helpers/RespondentHelpers';
import { returnValidUrl } from './helpers/RouterHelpers';

const getRepAboutYouCaseId = (req: AppRequest): string | undefined => {
  if (req.session.userCase?.id) {
    return req.session.userCase.id;
  }

  const match = req.url.match(/\/claimant-rep-(?:edit-name|edit-email|about-you)\/([0-9a-f-]{36})/i);
  return match?.[1];
};

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
    } else if (req.query.redirect === 'rep-answers') {
      redirectUrl = req.url.replace(InterceptPaths.REP_ANSWERS_CHANGE, languageParam);
      req.session.returnUrl = setCheckAnswersLanguage(req, PageUrls.CLAIMANT_REP_CHECK_ANSWERS);
    } else if (req.query.redirect === 'rep-about-you') {
      redirectUrl = req.url.replace(InterceptPaths.REP_ABOUT_YOU_CHANGE, languageParam);
      const caseId = getRepAboutYouCaseId(req);
      if (!caseId) {
        return res.redirect(ErrorPages.NOT_FOUND);
      }
      req.session.repAboutYouCaseId = caseId;
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

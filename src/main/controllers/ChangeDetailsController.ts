import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, InterceptPaths, PageUrls } from '../definitions/constants';

import { ValidRespondentUrls } from './helpers/RespondentHelpers';
import { returnValidUrl } from './helpers/RouterHelpers';

export default class ChangeDetailsController {
  public get = (req: AppRequest, res: Response): void => {
    let redirectUrl = req.url;
    if (req.query.redirect === 'answers') {
      redirectUrl = req.url.replace(InterceptPaths.ANSWERS_CHANGE, '');
      req.session.returnUrl = PageUrls.CHECK_ANSWERS;
    } else if (req.query.redirect === 'respondent') {
      redirectUrl = req.url.replace(InterceptPaths.RESPONDENT_CHANGE, '');
      req.session.returnUrl = PageUrls.RESPONDENT_DETAILS_CHECK;
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

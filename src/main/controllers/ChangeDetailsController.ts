import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, InterceptPaths, PageUrls } from '../definitions/constants';

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

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
      redirectUrl = ErrorPages.NOT_FOUND;
    }

    return res.redirect(redirectUrl);
  };
}

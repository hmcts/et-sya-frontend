import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';

export default class ChangeDetailsController {
  public get = (req: AppRequest, res: Response): void => {
    const changeString = '/change';
    const redirectUrl = req.url.replace(changeString, '');
    if (req.query.redirect === 'answers') {
      req.session.returnUrl = PageUrls.CHECK_ANSWERS;
    } else {
      req.session.returnUrl = PageUrls.RESPONDENT_DETAILS_CHECK;
    }

    return res.redirect(redirectUrl);
  };
}

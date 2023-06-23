import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';

export default class RespondentDetailsRedirectCheckAnswerController {
  public get = (req: AppRequest, res: Response): void => {
    req.session.respondentDetailsRedirectCheckAnswer = true;
    return res.redirect(PageUrls.RESPONDENT_DETAILS_CHECK);
  };
}

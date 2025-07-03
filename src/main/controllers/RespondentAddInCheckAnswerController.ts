import { Response } from 'express';
import { CaseStateCheck } from '../decorators/CaseStateCheck';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';

import { setUrlLanguage } from './helpers/LanguageHelper';
import { getRespondentRedirectUrl } from './helpers/RespondentHelpers';

export default class RespondentAddInCheckAnswerController {
  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    req.session.respondentRedirectCheckAnswer = true;
    const newRespondentNum =
      req.session.userCase.respondents !== undefined ? req.session.userCase.respondents.length + 1 : 1;
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_NAME);
    return res.redirect(getRespondentRedirectUrl(newRespondentNum, redirectUrl));
  };
}

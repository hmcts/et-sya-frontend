import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';

import { checkCaseStateAndRedirect } from './helpers/CaseHelpers';
import { setUrlLanguage } from './helpers/LanguageHelper';
import { getRespondentRedirectUrl } from './helpers/RespondentHelpers';

export default class RespondentAddInCheckAnswerController {
  public get = (req: AppRequest, res: Response): void => {
    checkCaseStateAndRedirect(req, res);
    req.session.respondentRedirectCheckAnswer = true;
    const newRespondentNum =
      req.session.userCase.respondents !== undefined ? req.session.userCase.respondents.length + 1 : 1;
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_NAME);
    return res.redirect(getRespondentRedirectUrl(newRespondentNum, redirectUrl));
  };
}

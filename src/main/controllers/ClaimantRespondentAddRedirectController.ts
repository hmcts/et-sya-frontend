import { Response } from 'express';

import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';

export default class ClaimantRespondentAddRedirectController {
  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    const respondents = req.session.userCase?.respondents;
    const nextRespondentNumber = respondents !== undefined ? respondents.length + 1 : 1;
    req.session.claimantRespondentNumber = nextRespondentNumber.toString();
    return res.redirect(PageUrls.CLAIMANT_RESPONDENT_NAME);
  };
}

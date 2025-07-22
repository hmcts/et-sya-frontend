import { Response } from 'express';

import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';
import { getLogger } from '../logger';

import { handleUpdateDraftCase } from './helpers/CaseHelpers';
import { setUrlLanguage } from './helpers/LanguageHelper';
import { getRespondentIndex, getRespondentsWithRemoved } from './helpers/RespondentHelpers';

const logger = getLogger('RespondentRemoveController');

export default class RespondentRemoveController {
  @CaseStateCheck()
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    req.session.userCase.respondents = getRespondentsWithRemoved(
      req.session.userCase.respondents,
      getRespondentIndex(req)
    );
    await handleUpdateDraftCase(req, logger);

    if (req.query !== undefined && req.query.redirect === 'answers') {
      return res.redirect(setUrlLanguage(req, PageUrls.CHECK_ANSWERS));
    } else {
      return res.redirect(setUrlLanguage(req, PageUrls.RESPONDENT_DETAILS_CHECK));
    }
  };
}

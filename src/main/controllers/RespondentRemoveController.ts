import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';

import { deleteRespondent, getRespondentIndex } from './helpers/RespondentHelpers';

export default class RespondentRemoveController {
  public get = (req: AppRequest, res: Response): void => {
    deleteRespondent(req.session.userCase, getRespondentIndex(req));

    if (req.query !== undefined && req.query.redirect === 'answers') {
      return res.redirect(PageUrls.CHECK_ANSWERS);
    } else {
      return res.redirect(PageUrls.RESPONDENT_DETAILS_CHECK);
    }
  };
}

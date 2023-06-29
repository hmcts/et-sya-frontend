import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';

import { deleteRespondent, getRespondentIndex } from './helpers/RespondentHelpers';

export default class RespondentRemoveController {
  public get = (req: AppRequest, res: Response): void => {
    deleteRespondent(req.session.userCase, getRespondentIndex(req));
    return res.redirect(PageUrls.RESPONDENT_DETAILS_CHECK);
  };
}

import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import {PageUrls } from '../definitions/constants';

export default class RemoveFileController {
  public get = (req: AppRequest, res: Response): void => {
    req.session.userCase.contactApplicationFile = undefined;
    res.redirect(PageUrls.CONTACT_APPLICATION);
  };
}

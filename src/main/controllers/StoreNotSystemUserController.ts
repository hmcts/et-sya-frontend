import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';

export default class StoreNotSystemUserController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    return res.redirect(PageUrls.STORED_APPLICATION_CONFIRMATION);
  };
}

import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { invokePCQ } from '../pcq';

export default class PcqController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    invokePCQ(req, res);
  }
}

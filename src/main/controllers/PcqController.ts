import { AppRequest } from '../definitions/appRequest';
import { invokePCQ } from '../pcq';

import { Response } from 'express';

export default class PcqController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    await invokePCQ(req, res);
  }
}

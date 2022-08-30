import config from 'config';
import { Response } from 'express';
import moment from 'moment';

import { AppRequest } from '../definitions/appRequest';

export default class SessionTimeoutController {
  public getExtendSession = (req: AppRequest, res: Response): void => {
    const timeout = moment().add(config.get('session.maxAgeInMs'), 'milliseconds');
    res.send({ timeout });
  };
}

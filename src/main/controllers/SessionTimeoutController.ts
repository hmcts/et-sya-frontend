import config from 'config';
import { Response } from 'express';
import moment from 'moment';
import { LoggerInstance } from 'winston';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';

export default class SessionTimeoutController {
  constructor(private logger: LoggerInstance) {}

  public getExtendSession = (req: AppRequest, res: Response): void => {
    const timeout = moment().add(config.get('session.maxAgeInMs'), 'milliseconds');
    this.logger.info('Extend session - setting timeout, ' + timeout);
    res.send({ timeout });
  };

  public getSessionEnded = (req: AppRequest, res: Response): void => {
    this.logger.info('Session ending and being destroyed');
    res.locals.isLoggedIn = false;
    req.session.destroy(() => res.redirect(PageUrls.HOME));
  };
}

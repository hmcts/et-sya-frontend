import config from 'config';
import { Response } from 'express';
import moment from 'moment';

import { AppRequest } from '../definitions/appRequest';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

export default class SessionTimeoutController {
  public getExtendSession = async (req: AppRequest, res: Response): Promise<void> => {
    const defaultMaxAge = Number(config.get<string>('session.maxAgeInMs'));
    const maxAgeInMs = await getFlagValue('et-sya-session-max-age', null);
    const timeout = moment().add(maxAgeInMs || defaultMaxAge, 'milliseconds');
    res.send({ timeout });
  };
}

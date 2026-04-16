import config from 'config';
import { Response } from 'express';
import moment from 'moment';

import { AppRequest } from '../definitions/appRequest';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

export default class SessionTimeoutController {
  public getExtendSession = async (req: AppRequest, res: Response): Promise<void> => {
    const defaultMaxAge = Number(config.get('session.maxAgeInMs'));
    const maxAgeInMs = ((await getFlagValue('et-sya-session-max-age', null)) as number) || defaultMaxAge;
    const timeout = moment().add(maxAgeInMs, 'milliseconds');
    res.send({ timeout });
  };
}

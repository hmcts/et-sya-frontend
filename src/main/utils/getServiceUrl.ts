import config from 'config';
import { Request } from 'express';

import { HTTPS_PROTOCOL } from '../definitions/constants';

export const getServiceUrl = (req: Request, path = ''): string => {
  const host = (req.headers['x-forwarded-host'] || req.hostname) as string;
  const port = req.app.locals.developmentMode ? `:${config.get('port')}` : '';

  return `${HTTPS_PROTOCOL}${host}${port}${path}`;
};

import config from 'config';
import { Application, Response } from 'express';

import { getRedirectUrl, getUserDetails } from '../../auth';
import { AppRequest } from '../../definitions/appRequest';
import { AuthUrls, HTTPS_PROTOCOL, PageUrls, RedisErrors } from '../../definitions/constants';

export class Oidc {
  public enableFor(app: Application): void {
    const port = app.locals.developmentMode ? `:${config.get('port')}` : '';
    const serviceUrl = (res: Response): string => `${HTTPS_PROTOCOL}${res.locals.host}${port}`;

    app.get(AuthUrls.LOGIN, (req, res) => {
      res.redirect(getRedirectUrl(serviceUrl(res), AuthUrls.CALLBACK, req.app.get('guid')));
    });

    app.get(AuthUrls.LOGOUT, (req, res) => {
      req.session.destroy(() => res.redirect(PageUrls.CLAIM_SAVED));
    });

    app.get(AuthUrls.CALLBACK, async (req: AppRequest, res: Response) => {
      const redisClient = req.app.locals.redisClient;
      const guid = req.query.guid;
      if (redisClient && guid) {
        redisClient.get(guid, (err: Error, typesOfClaim: string) => {
          if (typesOfClaim) {
            req.session.userCase.typeOfClaim = JSON.parse(typesOfClaim);
          }
          if (err) {
            const error = new Error(err.message);
            error.name = RedisErrors.FAILED_TO_RETREIVE;
            if (err.stack) {
              error.stack = err.stack;
            }
            throw error;
          }
        });
      }

      if (typeof req.query.code === 'string') {
        req.session.user = await getUserDetails(serviceUrl(res), req.query.code, AuthUrls.CALLBACK);
        req.session.save(() => res.redirect(PageUrls.NEW_ACCOUNT_LANDING));
      } else {
        res.redirect(AuthUrls.LOGIN);
      }
    });
  }
}

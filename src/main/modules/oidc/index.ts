import config from 'config';
import { Application, NextFunction, Response } from 'express';

import { getRedirectUrl, getUserDetails } from '../../auth';
import { AppRequest } from '../../definitions/appRequest';
import { AuthUrls, HTTPS_PROTOCOL, PageUrls, RedisErrors } from '../../definitions/constants';
import { createCase, getPreloginCaseData } from '../../services/CaseService';

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

    app.get(AuthUrls.CALLBACK, async (req: AppRequest, res: Response, next: NextFunction) => {
      const redisClient = req.app.locals?.redisClient;

      //Only go to new account landing page if it is a new user
      if (req.query?.state) {
        const guid = String(req.query?.state);
        if (typeof req.query.code === 'string') {
          req.session.user = await getUserDetails(serviceUrl(res), req.query.code, AuthUrls.CALLBACK);
          req.session.save();
        } else {
          return res.redirect(AuthUrls.LOGIN);
        }
        if (!req.session?.user?.accessToken) {
          return res.redirect(PageUrls.LIP_OR_REPRESENTATIVE);
        }

        if (redisClient && guid) {
          getPreloginCaseData(redisClient, guid)
            .then(caseType =>
              createCase(caseType, req.session.user.accessToken, config.get('services.etSyaApi.host'))
                .then(() => {
                  return res.redirect(PageUrls.NEW_ACCOUNT_LANDING);
                })
                .catch(() => {
                  //ToDo - needs to handle different error response
                })
            )
            .catch(err => next(err));
        } else {
          const err = new Error(RedisErrors.CLIENT_NOT_FOUND);
          err.name = RedisErrors.FAILED_TO_CONNECT;
          return next(err);
        }
      } else {
        //ToDo - if guid doesn't exist then go to dashboard page
      }
    });
  }
}

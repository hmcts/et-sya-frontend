import axios from 'axios';
import config from 'config';
import { Application, Response } from 'express';

import { getRedirectUrl, getUserDetails } from '../../auth';
import { AppRequest } from '../../definitions/appRequest';
import { YesOrNo } from '../../definitions/case';
import {
  AuthUrls,
  CacheMapNames,
  CcdDataModel,
  HTTPS_PROTOCOL,
  PageUrls,
  RedisErrors,
} from '../../definitions/constants';

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

    app.get(AuthUrls.CALLBACK, (req: AppRequest, res: Response) => {
      const redisClient = req.app.locals?.redisClient;
      const guid = req.query?.guid;
      let caseType: string;
      if (redisClient && guid) {
        redisClient.get(guid, (err: Error, userData: string) => {
          if (userData) {
            const userDataMap = new Map(JSON.parse(userData));
            switch (String(userDataMap.get(CacheMapNames.CASE_TYPE)).slice(1, -1)) {
              case YesOrNo.YES:
                caseType = CcdDataModel.SINGLE_CASE;
                break;
              case YesOrNo.NO:
                caseType = CcdDataModel.MULTIPLE_CASE;
                break;
            }
          }
          if (err) {
            const error = new Error(err.message);
            error.name = RedisErrors.FAILED_TO_RETREIVE;
            if (err.stack) {
              error.stack = err.stack;
            }
            throw error;
          } else {
            createCase();
          }
        });
      }

      const createCase = async () => {
        const conf = {
          headers: {
            Authorization: `Bearer ${req.session.user.accessToken}`,
          },
        };
        const body = {
          case_type: caseType,
          case_source: '',
        };

        const syaApiHost: string = config.get('services.etSyaApi.host');
        await axios
          .post(`${syaApiHost}/case-type/ET_EnglandWales/event-type/initiateCaseDraft/case`, body, conf)
          .then(async () => {
            if (typeof req.query.code === 'string') {
              req.session.user = await getUserDetails(serviceUrl(res), req.query.code, AuthUrls.CALLBACK);
              req.session.save(() => res.redirect(PageUrls.NEW_ACCOUNT_LANDING));
            } else {
              return res.redirect(PageUrls.TYPE_OF_CLAIM);
            }
          })
          .catch(() => {
            //to-do: should be handled by error handler
            return res.redirect(PageUrls.TYPE_OF_CLAIM);
          });
      };
    });
  }
}

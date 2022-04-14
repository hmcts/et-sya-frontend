import config from 'config';
import { Application, NextFunction, Response } from 'express';

import { getRedirectUrl, getUserDetails } from '../../auth';
import { AppRequest } from '../../definitions/appRequest';
import {
  AuthUrls,
  CaseApiErrors,
  EXISTING_USER,
  HTTPS_PROTOCOL,
  PageUrls,
  RedisErrors,
} from '../../definitions/constants';
import { formatCaseData, getCaseApi, getPreloginCaseData } from '../../services/CaseService';

const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('app');

export class Oidc {
  public enableFor(app: Application): void {
    const port = app.locals.developmentMode ? `:${config.get('port')}` : '';
    const serviceUrl = (res: Response): string => `${HTTPS_PROTOCOL}${res.locals.host}${port}`;

    app.get(AuthUrls.LOGIN, (req: AppRequest, res) => {
      let stateParam = '';
      req.session.guid ? (stateParam = req.session.guid) : (stateParam = EXISTING_USER);
      res.redirect(getRedirectUrl(serviceUrl(res), AuthUrls.CALLBACK, stateParam));
    });

    app.get(AuthUrls.LOGOUT, (req, res) => {
      req.session.destroy(() => res.redirect(PageUrls.CLAIM_SAVED));
    });

    app.get(AuthUrls.CALLBACK, (req: AppRequest, res: Response, next: NextFunction) => {
      idamCallbackHandler(req, res, next, serviceUrl(res));
    });
  }
}

export const idamCallbackHandler = async (
  req: AppRequest,
  res: Response,
  next: NextFunction,
  serviceUrl: string
): Promise<void> => {
  const redisClient = req.app.locals?.redisClient;
  if (typeof req.query.code === 'string' && typeof req.query.state === 'string') {
    req.session.user = await getUserDetails(serviceUrl, req.query.code, AuthUrls.CALLBACK);
    req.session.save();
  } else {
    return res.redirect(AuthUrls.LOGIN);
  }

  const guid = String(req.query?.state);

  if (guid !== EXISTING_USER) {
    if (!redisClient) {
      const err = new Error(RedisErrors.CLIENT_NOT_FOUND);
      err.name = RedisErrors.FAILED_TO_CONNECT;
      return next(err);
    }
    getPreloginCaseData(redisClient, guid)
      .then(caseType =>
        getCaseApi(req.session.user?.accessToken)
          .createCase(caseType)
          .then(() => {
            return res.redirect(PageUrls.NEW_ACCOUNT_LANDING);
          })
          .catch(() => {
            //ToDo - needs to handle different error response
          })
      )
      .catch(err => next(err));
  } else {
    getCaseApi(req.session.user?.accessToken)
      .getDraftCases()
      .then(apiRes => {
        if (apiRes.data.length === 0) {
          const error = new Error();
          error.name = CaseApiErrors.FAILED_TO_RETREIVE_CASE;
          return next(error);
        } else {
          const cases = apiRes.data;
          //We are not sure how multiple cases will be handled yet, so only fetching last case for now
          req.session.userCase = formatCaseData(cases[cases.length - 1]);
          req.session.save();
          return res.redirect(PageUrls.CLAIM_STEPS);
        }
      })
      .catch(err => {
        logger.log(err);
        const error = new Error(err);
        error.name = CaseApiErrors.FAILED_TO_RETREIVE_CASE;
        return next(error);
      });
  }
};

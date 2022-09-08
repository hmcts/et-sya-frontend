import config from 'config';
import { Application, NextFunction, Response } from 'express';

import { getRedirectUrl, getUserDetails } from '../../auth';
import { AppRequest } from '../../definitions/appRequest';
import { AuthUrls, EXISTING_USER, HTTPS_PROTOCOL, PageUrls, RedisErrors } from '../../definitions/constants';
import { CaseState } from '../../definitions/definition';
import { fromApiFormat } from '../../helper/ApiFormatter';
import { getPreloginCaseData } from '../../services/CacheService';
import { getCaseApi } from '../../services/CaseService';

import { noSignInRequiredEndpoints } from './noSignInRequiredEndpoints';

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
      req.session.destroy(() => {
        if (req.query.redirectUrl) {
          return res.redirect(req.query.redirectUrl as string);
        } else {
          return res.redirect(PageUrls.CLAIM_SAVED);
        }
      });
    });

    app.get(AuthUrls.CALLBACK, (req: AppRequest, res: Response, next: NextFunction) => {
      idamCallbackHandler(req, res, next, serviceUrl(res));
    });

    app.use(async (req: AppRequest, res: Response, next: NextFunction) => {
      if (req.session?.user) {
        // a nunjucks global variable 'isLoggedIn' has been created for the views
        // it is assigned the value of res.locals.isLoggedIn
        res.locals.isLoggedIn = true;
        next();
      } else if (noSignInRequiredEndpoints.includes(req.url) || process.env.IN_TEST) {
        next();
      } else {
        return res.redirect(AuthUrls.LOGIN);
      }
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
    // eslint-disable-next-line prettier/prettier
    req.session.user = await getUserDetails(serviceUrl, req.query.code, AuthUrls.CALLBACK);
    req.session.save();
  } else {
    return res.redirect(AuthUrls.LOGIN);
  }
  //For now if user account does not have the citizen role redirect to login
  if (!req.session.user?.isCitizen) {
    return res.redirect(AuthUrls.LOGIN);
  }

  const guid = String(req.query?.state);

  if (guid === EXISTING_USER) {
    if (!redisClient) {
      const err = new Error(RedisErrors.CLIENT_NOT_FOUND);
      err.name = RedisErrors.FAILED_TO_CONNECT;
      return next(err);
    }
    return res.redirect(PageUrls.CLAIMANT_APPLICATIONS);
  } else {
    try {
      const caseData = await getPreloginCaseData(redisClient, guid);
      const response = await getCaseApi(req.session.user?.accessToken).createCase(caseData, req.session.user);
      if (response.data.state === CaseState.AWAITING_SUBMISSION_TO_HMCTS) {
        logger.info(`Created Draft Case - ${response.data.id}`);
        req.session.userCase = fromApiFormat(response.data);
        return res.redirect(PageUrls.NEW_ACCOUNT_LANDING);
      }
      throw new Error('Draft Case was not created successfully');
    } catch (error) {
      //ToDo - needs to handle different error response
      logger.info(error);
    }
  }
};

import config from 'config';
import { Application, NextFunction, Response } from 'express';

import { getRedirectUrl, getUserDetails } from '../../auth';
import { CaseApiDataResponse } from '../../definitions/api/caseApiResponse';
import { AppRequest } from '../../definitions/appRequest';
import {
  AuthUrls,
  CaseApiErrors,
  EXISTING_USER,
  HTTPS_PROTOCOL,
  PageUrls,
  RedisErrors,
} from '../../definitions/constants';
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
      req.session.destroy(() => res.redirect(PageUrls.CLAIM_SAVED));
    });

    app.get(AuthUrls.CALLBACK, (req: AppRequest, res: Response, next: NextFunction) => {
      idamCallbackHandler(req, res, next, serviceUrl(res));
    });

    app.use(async (req: AppRequest, res: Response, next: NextFunction) => {
      if (req.session?.user) {
        next();
      } else if (noSignInRequiredEndpoints.includes(req.url)) {
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
    getCaseApi(req.session.user?.accessToken)
      .getDraftCases()
      .then(response => {
        if (response.data.length === 0) {
          return res.redirect(PageUrls.LIP_OR_REPRESENTATIVE);
        } else {
          // TODO Implement page for User to select case they want to continue
          logger.info('Retrieving Latest Draft Case');
          const casesByLastModified: CaseApiDataResponse[] = response.data.sort((a, b) => {
            const da = new Date(a.last_modified),
              db = new Date(b.last_modified);
            return db.valueOf() - da.valueOf();
          });
          req.session.userCase = fromApiFormat(casesByLastModified[0]);
          logger.info(`Retrieved case id - ${req.session.userCase.id}`);
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
  } else {
    getPreloginCaseData(redisClient, guid)
      .then(caseData =>
        getCaseApi(req.session.user?.accessToken)
          .createCase(caseData, req.session.user)
          .then(response => {
            if (response.data.state === CaseState.AWAITING_SUBMISSION_TO_HMCTS) {
              logger.info(`Created Draft Case - ${response.data.id}`);
              req.session.userCase = fromApiFormat(response.data);
              return res.redirect(PageUrls.NEW_ACCOUNT_LANDING);
            }
            throw new Error('Draft Case was not created successfully');
          })
          .catch(error => {
            //ToDo - needs to handle different error response
            logger.info(error);
          })
      )
      .catch(err => next(err));
  }
};

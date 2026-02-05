import * as url from 'url';

import config from 'config';
import { Application, NextFunction, Request, Response } from 'express';

import { getRedirectUrl, getUserDetails } from '../../auth';
import { AppRequest } from '../../definitions/appRequest';
import {
  ASSIGN_CLAIM_USER,
  AuthUrls,
  EXISTING_USER,
  HTTPS_PROTOCOL,
  PageUrls,
  RedisErrors,
  languages,
} from '../../definitions/constants';
import { CaseState } from '../../definitions/definition';
import { fromApiFormat } from '../../helper/ApiFormatter';
import { getLogger } from '../../logger';
import { getPreloginCaseData } from '../../services/CacheService';
import { getCaseApi } from '../../services/CaseService';

import { validateNoSignInEndpoints } from './noSignInRequiredEndpoints';

const logger = getLogger('oidc');

export class Oidc {
  public enableFor(app: Application): void {
    const port = app.locals.developmentMode ? `:${config.get('port')}` : '';
    const serviceUrl = (res: Response): string => `${HTTPS_PROTOCOL}${res.locals.host}${port}`;

    app.get(AuthUrls.LOGIN, (req: AppRequest, res) => {
      let stateParam;
      const languageParam = req.cookies.i18next === languages.WELSH ? languages.WELSH : languages.ENGLISH;
      if (req.session.guid) {
        stateParam = req.session.guid;
      } else if (req.session.isAssignClaim) {
        stateParam = ASSIGN_CLAIM_USER;
      } else {
        stateParam = EXISTING_USER;
      }
      stateParam = stateParam + '-' + languageParam;

      // Set the i18next cookie with HttpOnly flag
      res.cookie('i18next', languageParam, {
        secure: true, // Ensures the cookie is only sent over HTTPS
        sameSite: 'strict', // Helps prevent CSRF attacks
      });
      res.redirect(getRedirectUrl(serviceUrl(res), AuthUrls.CALLBACK, stateParam, languageParam));
    });

    app.get(AuthUrls.LOGOUT, (req, res) => {
      req.session.destroy(err => {
        if (err) {
          logger.error('Error destroying session');
        }
        if (req.query.redirectUrl) {
          return handleRedirectUrl(req, res);
        } else {
          return res.redirect(PageUrls.HOME);
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
      } else if (validateNoSignInEndpoints(req.url) || process.env.IN_TEST || '/extend-session' === req.url) {
        next();
      } else {
        return res.redirect(AuthUrls.LOGIN);
      }
    });
  }
}

function handleRedirectUrl(req: Request, res: Response) {
  const parsedUrl = url.parse(req.query.redirectUrl as string);
  if (parsedUrl.host !== req.headers.host && (req.query.redirectUrl as string) !== '/?lng=en') {
    logger.error('Unauthorised External Redirect Attempted to %s', parsedUrl.href);
    return res.redirect(PageUrls.HOME);
  }
  return res.redirect(req.query.redirectUrl as string);
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

  const state = String(req.query?.state);
  const guid = state.substring(0, state.lastIndexOf('-'));
  const langSuffix = state.substring(state.lastIndexOf('-') + 1, state.length);
  const langPrefix = '?lng=';
  const lang = langPrefix + langSuffix;

  if (guid === ASSIGN_CLAIM_USER) {
    return res.redirect(PageUrls.YOUR_DETAILS_FORM + lang);
  } else if (guid === EXISTING_USER) {
    if (!redisClient) {
      const err = new Error(RedisErrors.CLIENT_NOT_FOUND);
      err.name = RedisErrors.FAILED_TO_CONNECT;
      return next(err);
    }
    return res.redirect(PageUrls.CLAIMANT_APPLICATIONS + lang);
  } else {
    try {
      const caseData = await getPreloginCaseData(redisClient, guid);
      const response = await getCaseApi(req.session.user?.accessToken).createCase(caseData, req.session.user);
      if (response.data.state === CaseState.AWAITING_SUBMISSION_TO_HMCTS) {
        logger.info(`Created Draft Case - ${response.data.id}`);
        req.session.userCase = fromApiFormat(response.data);
        return res.redirect(PageUrls.NEW_ACCOUNT_LANDING + lang);
      }
      logger.error('Draft Case was not created successfully');
    } catch (error) {
      //ToDo - needs to handle different error response
      logger.error(error.message);
    }
  }
};

import * as path from 'path';

import * as bodyParser from 'body-parser';
import config from 'config';
import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import favicon from 'serve-favicon';

import { AppRequest } from './definitions/appRequest';
import { CaseApiErrors, PageUrls, RedisErrors } from './definitions/constants';
import setupDev from './development';
import { AppInsights } from './modules/appinsights';
import CSRFToken from './modules/csrf';
import { HealthCheck } from './modules/health';
import { Helmet } from './modules/helmet';
import { I18Next } from './modules/i18next';
import { Nunjucks } from './modules/nunjucks';
import { Oidc } from './modules/oidc';
import { PropertiesVolume } from './modules/properties-volume';
import { Routes } from './modules/routes/routes';
import { Session } from './modules/session';

import { HTTPError } from 'HttpError';

const env = process.env.NODE_ENV || 'development';
const developmentMode = env === 'development';

export const app = express();
app.locals.ENV = env;
app.locals.developmentMode = developmentMode;

new PropertiesVolume().enableFor(app);
new AppInsights().enable();
new Nunjucks(developmentMode).enableFor(app);

new Helmet(config.get('security'), [
  process.env.IDAM_WEB_URL ?? config.get('services.idam.authorizationURL'),
  process.env.PCQ_URL ?? config.get('services.pcq.url'),
  process.env.ET1_BASE_URL ?? config.get('services.et1Legacy.url'),
]).enableFor(app);

new I18Next().enableFor(app);
new Session().enableFor(app);
new HealthCheck().enableFor(app);
app.enable('trust proxy');
app.use(favicon(path.join(__dirname, '/public/assets/images/favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, max-age=0, must-revalidate, no-store');
  next();
});
app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

new CSRFToken().enableFor(app);
new Oidc().enableFor(app);
new Routes().enableFor(app);

setupDev(app, developmentMode);
// returning "not found" page for requests with paths not resolved by the router
app.use((req, res) => {
  res.status(404);
  res.render('not-found');
});

app.use((error: HTTPError, request: Request, response: Response, next: NextFunction) => {
  if (
    error.name === RedisErrors.FAILED_TO_CONNECT ||
    error.name === RedisErrors.FAILED_TO_SAVE ||
    error.name === RedisErrors.FAILED_TO_RETRIEVE ||
    error.name === CaseApiErrors.FAILED_TO_RETRIEVE_CASE
  ) {
    request.app.set(RedisErrors.REDIS_ERROR, RedisErrors.DISPLAY_MESSAGE);
    response.redirect(PageUrls.TYPE_OF_CLAIM);
  } else {
    next(error);
  }
});

// error handler
app.use((err: HTTPError, req: AppRequest, res: express.Response) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = env === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

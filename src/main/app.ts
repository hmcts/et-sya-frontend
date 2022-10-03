import * as path from 'path';

// eslint-disable-next-line import/no-unresolved
import { HTTPError } from 'HttpError';
import * as bodyParser from 'body-parser';
import config from 'config';
import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import favicon from 'serve-favicon';

import { AppRequest } from './definitions/appRequest';
import { CaseApiErrors, PageUrls, RedisErrors } from './definitions/constants';
import setupDev from './development';
import { AppInsights } from './modules/appinsights';
import { Container } from './modules/awilix';
import { HealthCheck } from './modules/health';
import { Helmet } from './modules/helmet';
import { I18Next } from './modules/i18next';
import { Nunjucks } from './modules/nunjucks';
import { Oidc } from './modules/oidc';
import { PropertiesVolume } from './modules/properties-volume';
import { Session } from './modules/session';
import routes from './routes/routes';

const { Logger } = require('@hmcts/nodejs-logging');

const env = process.env.NODE_ENV || 'development';
const developmentMode = env === 'development';

export const app = express();
app.locals.ENV = env;
app.locals.developmentMode = developmentMode;

const logger = Logger.getLogger('app');

new PropertiesVolume().enableFor(app);
logger.info('Properties volume enabled');

new AppInsights().enable();
logger.info('App insights');
logMemUsage();

new Nunjucks(developmentMode).enableFor(app);
logger.info('Nunjucks');
logMemUsage();

new Helmet(config.get('security'), [
  config.get('services.idam.authorizationURL'),
  config.get('services.pcq.url'),
  config.get('services.et1Legacy.url'),
]).enableFor(app);

logger.info('Helmet');
logMemUsage();

new Container().enableFor(app);
logger.info('Container read dir');
logMemUsage();

new I18Next().enableFor(app);
logger.info('I18Next translations');
logMemUsage();

new Session().enableFor(app);
logger.info('Sessions');
logMemUsage();

new HealthCheck().enableFor(app);
logger.info('Health Check');
logMemUsage();

app.use(favicon(path.join(__dirname, '/public/assets/images/favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, max-age=0, must-revalidate, no-store');
  next();
});

new Oidc().enableFor(app);
logger.info('Oidc');
logMemUsage();

routes(app);
logger.info('routes added');
logMemUsage();

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
  logger.error(`${err.stack || err}`);

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = env === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

function logMemUsage() {
  const used = process.memoryUsage();
  logger.info(`rss ${Math.round((used.rss / 1024 / 1024) * 100) / 100} MB`);
  logger.info(`heapUsed ${Math.round((used.heapUsed / 1024 / 1024) * 100) / 100} MB`);
  logger.info(`heapTotal ${Math.round((used.heapTotal / 1024 / 1024) * 100) / 100} MB`);
  logger.info(`arrayBuffers ${Math.round((used.arrayBuffers / 1024 / 1024) * 100) / 100} MB`);
  logger.info(`external ${Math.round((used.external / 1024 / 1024) * 100) / 100} MB`);
}

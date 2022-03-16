import * as path from 'path';

// eslint-disable-next-line import/no-unresolved
import { HTTPError } from 'HttpError';
import * as bodyParser from 'body-parser';
import config from 'config';
import cookieParser from 'cookie-parser';
import express from 'express';
import favicon from 'serve-favicon';

import { AppRequest } from './definitions/appRequest';
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

new Nunjucks(developmentMode).enableFor(app);
logger.info('Nunjucks');

new Helmet(config.get('security')).enableFor(app);
logger.info('Helmet');

new Container().enableFor(app);
logger.info('Container read dir');

new I18Next().enableFor(app);
logger.info('I18Next translations');

new Session().enableFor(app);
logger.info('Sessions');

new Oidc().enableFor(app);
logger.info('Oidc');

new HealthCheck().enableFor(app);
logger.info('Health Check');

app.use(favicon(path.join(__dirname, '/public/assets/images/favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, max-age=0, must-revalidate, no-store');
  next();
});

routes(app);

setupDev(app, developmentMode);
// returning "not found" page for requests with paths not resolved by the router
app.use((req, res) => {
  res.status(404);
  res.render('not-found');
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

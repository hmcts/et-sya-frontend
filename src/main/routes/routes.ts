import * as os from 'os';
import { Application } from 'express';
import { infoRequestHandler } from '@hmcts/info-provider';
import DobController from '../controllers/dob/DobController';
import { dobFormContent } from '../controllers/dob/content';
const healthcheck = require('@hmcts/nodejs-healthcheck');

export default function (app: Application): void {
  app.get('/', app.locals.container.cradle.homeController.get);
  app.get('/lip-or-representative', app.locals.container.cradle.lipOrRepController.get);
  app.post('/lip-or-representative', app.locals.container.cradle.lipOrRepController.post);
  app.get('/single-or-multiple-claim', app.locals.container.cradle.singleOrMultipleController.get);
  
  app.get(
    '/info',
    infoRequestHandler({
      extraBuildInfo: {
        host: os.hostname(),
        name: 'et-sya-frontend',
        uptime: process.uptime(),
      },
      info: {
      },
    }),
  );
  app.get('/dob', new DobController(dobFormContent).get);
  app.post('/dob', new DobController(dobFormContent).post);
  
  const healthCheckConfig = {
    checks: {
      sampleCheck: healthcheck.raw(() => healthcheck.up()),
    },
  };

  healthcheck.addTo(app, healthCheckConfig);
}

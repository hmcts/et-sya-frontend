import * as os from 'os';
import { Application } from 'express';
import { infoRequestHandler } from '@hmcts/info-provider';
const healthcheck = require('@hmcts/nodejs-healthcheck');

export default function(app: Application): void {
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
  app.get('/dob-details', app.locals.container.cradle.dobController.get);
  app.post('/dob-details', app.locals.container.cradle.dobController.post);
  app.get('/gender-details', app.locals.container.cradle.genderDetailsController.get);
  app.get('/address-details', app.locals.container.cradle.addressDetailsController.get);
  app.post('/address-details', app.locals.container.cradle.addressDetailsController.post);

  const healthCheckConfig = {
    checks: {
      sampleCheck: healthcheck.raw(() => healthcheck.up()),
    },
  };

  healthcheck.addTo(app, healthCheckConfig);
}

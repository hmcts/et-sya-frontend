import * as os from 'os';
import { Application } from 'express';
import { infoRequestHandler } from '@hmcts/info-provider';
const healthcheck = require('@hmcts/nodejs-healthcheck');

export default function (app: Application): void {
  app.get('/', app.locals.container.cradle.onboardingController.get);
  app.get(
    '/info',
    infoRequestHandler({
      extraBuildInfo: {
        host: os.hostname(),
        name: 'ET-SYA-frontend',
        uptime: process.uptime(),
      },
      info: {
      },
    }),
  );
  
  const healthCheckConfig = {
    checks: {
      sampleCheck: healthcheck.raw(() => healthcheck.up()),
    },
  };

  healthcheck.addTo(app, healthCheckConfig);
}

import * as os from 'os';
import { Application } from 'express';
import { infoRequestHandler } from '@hmcts/info-provider';
import DobController from '../controllers/dob/DobController';
import { dobFormContent } from '../controllers/dob/content';
import GenderDetailsController from '../controllers/gender_details/GenderDetailsController';
const healthcheck = require('@hmcts/nodejs-healthcheck');

export default function (app: Application): void {
  app.get('/', app.locals.container.cradle.homeController.get);
  app.get('/lip-or-representative', app.locals.container.cradle.lipOrRepController.get);
  app.post('/lip-or-representative', app.locals.container.cradle.lipOrRepController.post);
  app.get('/single-or-multiple-claim', app.locals.container.cradle.singleOrMultipleController.get);
  app.post('/single-or-multiple-claim', app.locals.container.cradle.singleOrMultipleController.post);
  

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

  app.get('/would-you-want-to-take-part-in-video-hearings', app.locals.container.cradle.videoHearingsController.get);
  app.post('/would-you-want-to-take-part-in-video-hearings', app.locals.container.cradle.videoHearingsController.post);

  app.get('/steps-to-making-your-claim', app.locals.container.cradle.stepsToMakingYourClaimController.get);
  app.get('/your-claim-has-been-saved', app.locals.container.cradle.claimSavedController.get);

  app.get('/dob-details', new DobController(dobFormContent).get);
  app.post('/dob-details', new DobController(dobFormContent).post);
  app.get('/gender-details', new GenderDetailsController().get);
  
  const healthCheckConfig = {
    checks: {
      sampleCheck: healthcheck.raw(() => healthcheck.up()),
    },
  };

  healthcheck.addTo(app, healthCheckConfig);
}

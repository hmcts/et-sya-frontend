import * as os from 'os';

import { infoRequestHandler } from '@hmcts/info-provider';
import { Application } from 'express';

const healthcheck = require('@hmcts/nodejs-healthcheck');

export default function (app: Application): void {
  app.get('/', app.locals.container.cradle.homeController.get);
  app.get('/checklist', app.locals.container.cradle.checklistController.get);
  app.get('/new-account-landing', app.locals.container.cradle.newAccountLandingController.get);
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
      info: {},
    })
  );

  app.get('/dob-details', app.locals.container.cradle.dobController.get);
  app.post('/dob-details', app.locals.container.cradle.dobController.post);
  app.get('/gender-details', app.locals.container.cradle.genderDetailsController.get);
  app.get('/address-details', app.locals.container.cradle.addressDetailsController.get);
  app.post('/address-details', app.locals.container.cradle.addressDetailsController.post);

  app.get('/would-you-want-to-take-part-in-video-hearings', app.locals.container.cradle.videoHearingsController.get);
  app.post('/would-you-want-to-take-part-in-video-hearings', app.locals.container.cradle.videoHearingsController.post);

  app.get('/steps-to-making-your-claim', app.locals.container.cradle.stepsToMakingYourClaimController.get);
  app.get('/your-claim-has-been-saved', app.locals.container.cradle.claimSavedController.get);
  app.get('/return-to-existing', app.locals.container.cradle.returnToExistingController.get);
  app.post('/return-to-existing', app.locals.container.cradle.returnToExistingController.post);

  app.get('/do-you-have-an-acas-single-resps', app.locals.container.cradle.acasSingleClaimController.get);
  app.post('/do-you-have-an-acas-single-resps', app.locals.container.cradle.acasSingleClaimController.post);

  const healthCheckConfig = {
    checks: {
      sampleCheck: healthcheck.raw(() => healthcheck.up()),
    },
  };

  healthcheck.addTo(app, healthCheckConfig);
}

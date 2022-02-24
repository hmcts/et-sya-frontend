import os from 'os';

import { infoRequestHandler } from '@hmcts/info-provider';
import { Application } from 'express';

import { PageUrls } from '../definitions/constants';

export default function (app: Application): void {
  app.get(PageUrls.HOME, app.locals.container.cradle.homeController.get);
  app.get(PageUrls.CHECKLIST, app.locals.container.cradle.checklistController.get);
  app.get(PageUrls.NEW_ACCOUNT_LANDING, app.locals.container.cradle.newAccountLandingController.get);
  app.get(PageUrls.LIP_OR_REPRESENTATIVE, app.locals.container.cradle.lipOrRepController.get);
  app.post(PageUrls.LIP_OR_REPRESENTATIVE, app.locals.container.cradle.lipOrRepController.post);
  app.get(PageUrls.SINGLE_OR_MULTIPLE_CLAIM, app.locals.container.cradle.singleOrMultipleController.get);
  app.post(PageUrls.SINGLE_OR_MULTIPLE_CLAIM, app.locals.container.cradle.singleOrMultipleController.post);
  app.get(PageUrls.MULTIPLE_RESPONDENT_CHECK, app.locals.container.cradle.multipleRespondentCheckController.get);
  app.post(PageUrls.MULTIPLE_RESPONDENT_CHECK, app.locals.container.cradle.multipleRespondentCheckController.post);
  app.get(PageUrls.ACAS_SINGLE_CLAIM, app.locals.container.cradle.acasSingleClaimController.get);
  app.post(PageUrls.ACAS_SINGLE_CLAIM, app.locals.container.cradle.acasSingleClaimController.post);
  app.get(PageUrls.ACAS_MULTIPLE_CLAIM, app.locals.container.cradle.acasMultipleController.get);
  app.post(PageUrls.ACAS_MULTIPLE_CLAIM, app.locals.container.cradle.acasMultipleController.post);
  app.get(PageUrls.NO_ACAS_NUMBER, app.locals.container.cradle.validNoAcasReasonController.get);
  app.post(PageUrls.NO_ACAS_NUMBER, app.locals.container.cradle.validNoAcasReasonController.post);
  app.get(PageUrls.CONTACT_ACAS, app.locals.container.cradle.contactAcasController.get);
  app.get(PageUrls.DOB_DETAISLS, app.locals.container.cradle.dobController.get);
  app.post(PageUrls.DOB_DETAISLS, app.locals.container.cradle.dobController.post);
  app.get(PageUrls.GENDER_DETAILS, app.locals.container.cradle.genderDetailsController.get);
  app.get(PageUrls.ADDRESS_DETAILS, app.locals.container.cradle.addressDetailsController.get);
  app.post(PageUrls.ADDRESS_DETAILS, app.locals.container.cradle.addressDetailsController.post);
  app.get(PageUrls.TELEPHONE_NUMBER, app.locals.container.cradle.telNumberController.get);
  app.post(PageUrls.TELEPHONE_NUMBER, app.locals.container.cradle.telNumberController.post);
  app.get(PageUrls.VIDEO_HEARINGS, app.locals.container.cradle.videoHearingsController.get);
  app.post(PageUrls.VIDEO_HEARINGS, app.locals.container.cradle.videoHearingsController.post);
  app.get(PageUrls.CLAIM_STEPS, app.locals.container.cradle.stepsToMakingYourClaimController.get);
  app.get(PageUrls.CLAIM_SAVED, app.locals.container.cradle.claimSavedController.get);
  app.get(PageUrls.RETURN_TO_EXISTING, app.locals.container.cradle.returnToExistingController.get);
  app.post(PageUrls.RETURN_TO_EXISTING, app.locals.container.cradle.returnToExistingController.post);
  app.get(PageUrls.UPDATE_PREFERENCES, app.locals.container.cradle.updatePreferenceController.get);
  app.post(PageUrls.UPDATE_PREFERENCES, app.locals.container.cradle.updatePreferenceController.post);
  app.get(PageUrls.PRESENT_EMPLOYER, app.locals.container.cradle.presentEmployerController.get);
  app.post(PageUrls.PRESENT_EMPLOYER, app.locals.container.cradle.presentEmployerController.post);
  app.get(PageUrls.TYPE_OF_CLAIM, app.locals.container.cradle.typeOfClaimController.get);
  app.post(PageUrls.TYPE_OF_CLAIM, app.locals.container.cradle.typeOfClaimController.post);
  app.get(PageUrls.PAST_EMPLOYER, app.locals.container.cradle.pastEmployerController.get);
  app.post(PageUrls.PAST_EMPLOYER, app.locals.container.cradle.pastEmployerController.post);
  app.get(
    PageUrls.INFO,
    infoRequestHandler({
      extraBuildInfo: {
        host: os.hostname(),
        name: 'et-sya-frontend',
        uptime: process.uptime(),
      },
      info: {},
    })
  );
}

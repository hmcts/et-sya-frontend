import os from 'os';

import { infoRequestHandler } from '@hmcts/info-provider';
import { Application } from 'express';

import { PageUrls } from '../definitions/constants';

export default function (app: Application): void {
  app.get(PageUrls.PCQ, app.locals.container.cradle.pcqController.get);
  app.get(PageUrls.HOME, app.locals.container.cradle.homeController.get);
  app.get(PageUrls.CHECKLIST, app.locals.container.cradle.checklistController.get);
  app.get(PageUrls.NEW_ACCOUNT_LANDING, app.locals.container.cradle.newAccountLandingController.get);
  app.get(PageUrls.LIP_OR_REPRESENTATIVE, app.locals.container.cradle.lipOrRepController.get);
  app.post(PageUrls.LIP_OR_REPRESENTATIVE, app.locals.container.cradle.lipOrRepController.post);
  app.get(PageUrls.SINGLE_OR_MULTIPLE_CLAIM, app.locals.container.cradle.singleOrMultipleController.get);
  app.post(PageUrls.SINGLE_OR_MULTIPLE_CLAIM, app.locals.container.cradle.singleOrMultipleController.post);
  app.get(PageUrls.ACAS_MULTIPLE_CLAIM, app.locals.container.cradle.acasMultipleController.get);
  app.post(PageUrls.ACAS_MULTIPLE_CLAIM, app.locals.container.cradle.acasMultipleController.post);
  app.get(PageUrls.NO_ACAS_NUMBER, app.locals.container.cradle.validNoAcasReasonController.get);
  app.post(PageUrls.NO_ACAS_NUMBER, app.locals.container.cradle.validNoAcasReasonController.post);
  app.get(PageUrls.CONTACT_ACAS, app.locals.container.cradle.contactAcasController.get);
  app.get(PageUrls.DOB_DETAILS, app.locals.container.cradle.dobController.get);
  app.post(PageUrls.DOB_DETAILS, app.locals.container.cradle.dobController.post);
  app.get(PageUrls.GENDER_DETAILS, app.locals.container.cradle.genderDetailsController.get);
  app.post(PageUrls.GENDER_DETAILS, app.locals.container.cradle.genderDetailsController.post);
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
  app.get(PageUrls.JOB_TITLE, app.locals.container.cradle.jobTitleController.get);
  app.post(PageUrls.JOB_TITLE, app.locals.container.cradle.jobTitleController.post);
  app.get(PageUrls.STILL_WORKING, app.locals.container.cradle.stillWorkingController.get);
  app.post(PageUrls.STILL_WORKING, app.locals.container.cradle.stillWorkingController.post);
  app.get(PageUrls.TYPE_OF_CLAIM, app.locals.container.cradle.typeOfClaimController.get);
  app.post(PageUrls.TYPE_OF_CLAIM, app.locals.container.cradle.typeOfClaimController.post);
  app.get(PageUrls.PAST_EMPLOYER, app.locals.container.cradle.pastEmployerController.get);
  app.post(PageUrls.PAST_EMPLOYER, app.locals.container.cradle.pastEmployerController.post);
  app.get(PageUrls.PLACE_OF_WORK, app.locals.container.cradle.placeOfWorkController.get);
  app.post(PageUrls.PLACE_OF_WORK, app.locals.container.cradle.placeOfWorkController.post);
  app.post(PageUrls.ADDRESS_LOOK_UP, app.locals.container.cradle.addressLookupController.post);
  app.get(PageUrls.NOTICE_PERIOD, app.locals.container.cradle.noticePeriodController.get);
  app.post(PageUrls.NOTICE_PERIOD, app.locals.container.cradle.noticePeriodController.post);
  app.get(PageUrls.NOTICE_TYPE, app.locals.container.cradle.noticeTypeController.get);
  app.get(PageUrls.NOTICE_LENGTH, app.locals.container.cradle.noticeLengthController.get);
  app.post(PageUrls.NOTICE_LENGTH, app.locals.container.cradle.noticeLengthController.post);
  app.post(PageUrls.NOTICE_TYPE, app.locals.container.cradle.noticeTypeController.post);
  app.get(PageUrls.PENSION, app.locals.container.cradle.pensionController.get);
  app.post(PageUrls.PENSION, app.locals.container.cradle.pensionController.post);
  app.get(PageUrls.START_DATE, app.locals.container.cradle.startDateController.get);
  app.post(PageUrls.START_DATE, app.locals.container.cradle.startDateController.post);
  app.get(PageUrls.NOTICE_END, app.locals.container.cradle.noticeEndController.get);
  app.post(PageUrls.NOTICE_END, app.locals.container.cradle.noticeEndController.post);
  app.get(PageUrls.NOTICE_PAY, app.locals.container.cradle.noticePayController.get);
  app.post(PageUrls.NOTICE_PAY, app.locals.container.cradle.noticePayController.post);
  app.get(PageUrls.AVERAGE_WEEKLY_HOURS, app.locals.container.cradle.averageWeeklyHoursController.get);
  app.post(PageUrls.AVERAGE_WEEKLY_HOURS, app.locals.container.cradle.averageWeeklyHoursController.post);
  app.get(PageUrls.PAY, app.locals.container.cradle.payController.get);
  app.post(PageUrls.PAY, app.locals.container.cradle.payController.post);
  app.get(PageUrls.BENEFITS, app.locals.container.cradle.benefitsController.get);
  app.post(PageUrls.BENEFITS, app.locals.container.cradle.benefitsController.post);
  app.get(PageUrls.REASONABLE_ADJUSTMENTS, app.locals.container.cradle.reasonableAdjustmentsController.get);
  app.post(PageUrls.REASONABLE_ADJUSTMENTS, app.locals.container.cradle.reasonableAdjustmentsController.post);
  app.get(PageUrls.DOCUMENTS, app.locals.container.cradle.documentsController.get);
  app.post(PageUrls.DOCUMENTS, app.locals.container.cradle.documentsController.post);
  app.get(PageUrls.COMMUNICATING, app.locals.container.cradle.communicatingController.get);
  app.post(PageUrls.COMMUNICATING, app.locals.container.cradle.communicatingController.post);
  app.get(PageUrls.SUPPORT, app.locals.container.cradle.supportController.get);
  app.post(PageUrls.SUPPORT, app.locals.container.cradle.supportController.post);
  app.get(PageUrls.COMFORTABLE, app.locals.container.cradle.comfortableController.get);
  app.post(PageUrls.COMFORTABLE, app.locals.container.cradle.comfortableController.post);
  app.get(PageUrls.TRAVEL, app.locals.container.cradle.travelController.get);
  app.post(PageUrls.TRAVEL, app.locals.container.cradle.travelController.post);
  app.get(PageUrls.NEW_JOB, app.locals.container.cradle.newJobController.get);
  app.post(PageUrls.NEW_JOB, app.locals.container.cradle.newJobController.post);
  app.get(PageUrls.NEW_JOB_PAY, app.locals.container.cradle.newJobPayController.get);
  app.post(PageUrls.NEW_JOB_PAY, app.locals.container.cradle.newJobPayController.post);
  app.get(PageUrls.NEW_JOB_START_DATE, app.locals.container.cradle.newJobStartDateController.get);
  app.post(PageUrls.NEW_JOB_START_DATE, app.locals.container.cradle.newJobStartDateController.post);
  app.get(PageUrls.CLAIM_SUBMITTED, app.locals.container.cradle.claimSubmittedController.get);
  app.get(PageUrls.CHECK_ANSWERS, app.locals.container.cradle.checkYourAnswersController.get);
  app.get(PageUrls.DESIRED_CLAIM_OUTCOME, app.locals.container.cradle.desiredClaimOutcomeController.get);
  app.post(PageUrls.DESIRED_CLAIM_OUTCOME, app.locals.container.cradle.desiredClaimOutcomeController.post);
  app.get(PageUrls.SUMMARISE_YOUR_CLAIM, app.locals.container.cradle.summariseYourClaimController.get);
  app.post(PageUrls.SUMMARISE_YOUR_CLAIM, app.locals.container.cradle.summariseYourClaimController.post);
  app.get(PageUrls.END_DATE, app.locals.container.cradle.endDateController.get);
  app.post(PageUrls.END_DATE, app.locals.container.cradle.endDateController.post);
  app.get(PageUrls.COMPENSATION_OUTCOME, app.locals.container.cradle.compensationOutcomeController.get);
  app.post(PageUrls.COMPENSATION_OUTCOME, app.locals.container.cradle.compensationOutcomeController.post);
  app.get(
    PageUrls.TRIBUNAL_RECOMMENDATION_OUTCOME,
    app.locals.container.cradle.tribunalRecommendationOutcomeController.get
  );
  app.post(
    PageUrls.TRIBUNAL_RECOMMENDATION_OUTCOME,
    app.locals.container.cradle.tribunalRecommendationOutcomeController.post
  );
  app.get(PageUrls.DOWNLOAD_CLAIM, app.locals.container.cradle.downloadClaimController.get);
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

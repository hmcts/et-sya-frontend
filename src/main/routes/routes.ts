import os from 'os';

import { infoRequestHandler } from '@hmcts/info-provider';
import { Application } from 'express';

import { InterceptPaths, PageUrls, Urls } from '../definitions/constants';

const multer = require('multer');
const handleUploads = multer({
  //must be set to prevent ddos
  limits: {
    fileSize: 500000000,
  },
});

export default function (app: Application): void {
  app.get(Urls.PCQ, app.locals.container.cradle.pcqController.get);
  app.get(PageUrls.HOME, app.locals.container.cradle.homeController.get);
  app.get(PageUrls.CHECKLIST, app.locals.container.cradle.checklistController.get);
  app.get(PageUrls.NEW_ACCOUNT_LANDING, app.locals.container.cradle.newAccountLandingController.get);
  app.get(PageUrls.PERSONAL_DETAILS_CHECK, app.locals.container.cradle.personalDetailsCheckController.get);
  app.post(PageUrls.PERSONAL_DETAILS_CHECK, app.locals.container.cradle.personalDetailsCheckController.post);
  app.get(PageUrls.LIP_OR_REPRESENTATIVE, app.locals.container.cradle.lipOrRepController.get);
  app.post(PageUrls.LIP_OR_REPRESENTATIVE, app.locals.container.cradle.lipOrRepController.post);
  app.get(PageUrls.SINGLE_OR_MULTIPLE_CLAIM, app.locals.container.cradle.singleOrMultipleController.get);
  app.post(PageUrls.SINGLE_OR_MULTIPLE_CLAIM, app.locals.container.cradle.singleOrMultipleController.post);
  app.get(PageUrls.ACAS_MULTIPLE_CLAIM, app.locals.container.cradle.acasMultipleController.get);
  app.post(PageUrls.ACAS_MULTIPLE_CLAIM, app.locals.container.cradle.acasMultipleController.post);
  app.get(PageUrls.VALID_ACAS_REASON, app.locals.container.cradle.validNoAcasReasonController.get);
  app.post(PageUrls.VALID_ACAS_REASON, app.locals.container.cradle.validNoAcasReasonController.post);
  app.get(PageUrls.COOKIE_PREFERENCES, app.locals.container.cradle.cookiePreferencesController.get);
  app.get(
    PageUrls.RESPONDENT_REST_PREFIX + PageUrls.RESPONDENT_NAME,
    app.locals.container.cradle.respondentNameController.get
  );
  app.post(
    PageUrls.RESPONDENT_REST_PREFIX + PageUrls.RESPONDENT_NAME,
    app.locals.container.cradle.respondentNameController.post
  );
  app.get(
    PageUrls.RESPONDENT_REST_PREFIX + PageUrls.RESPONDENT_ADDRESS,
    app.locals.container.cradle.respondentAddressController.get
  );
  app.post(
    PageUrls.RESPONDENT_REST_PREFIX + PageUrls.RESPONDENT_ADDRESS,
    app.locals.container.cradle.respondentAddressController.post
  );
  app.get(
    PageUrls.RESPONDENT_REST_PREFIX + PageUrls.WORK_ADDRESS,
    app.locals.container.cradle.workAddressController.get
  );
  app.post(
    PageUrls.RESPONDENT_REST_PREFIX + PageUrls.WORK_ADDRESS,
    app.locals.container.cradle.workAddressController.post
  );
  app.get(
    PageUrls.RESPONDENT_REST_PREFIX + PageUrls.PLACE_OF_WORK,
    app.locals.container.cradle.placeOfWorkController.get
  );
  app.post(
    PageUrls.RESPONDENT_REST_PREFIX + PageUrls.PLACE_OF_WORK,
    app.locals.container.cradle.placeOfWorkController.post
  );
  app.get(
    PageUrls.RESPONDENT_REST_PREFIX + PageUrls.ACAS_CERT_NUM,
    app.locals.container.cradle.acasCertNumController.get
  );
  app.post(
    PageUrls.RESPONDENT_REST_PREFIX + PageUrls.ACAS_CERT_NUM,
    app.locals.container.cradle.acasCertNumController.post
  );
  app.get(
    PageUrls.RESPONDENT_REST_PREFIX + PageUrls.NO_ACAS_NUMBER,
    app.locals.container.cradle.noAcasNumberController.get
  );
  app.post(
    PageUrls.RESPONDENT_REST_PREFIX + PageUrls.NO_ACAS_NUMBER,
    app.locals.container.cradle.noAcasNumberController.post
  );
  app.get(PageUrls.RESPONDENT_DETAILS_CHECK, app.locals.container.cradle.respondentDetailsCheckController.get);
  app.post(PageUrls.RESPONDENT_DETAILS_CHECK, app.locals.container.cradle.respondentDetailsCheckController.post);
  app.get(
    PageUrls.EMPLOYMENT_RESPONDENT_TASK_CHECK,
    app.locals.container.cradle.employmentAndRespondentCheckController.get
  );
  app.post(
    PageUrls.EMPLOYMENT_RESPONDENT_TASK_CHECK,
    app.locals.container.cradle.employmentAndRespondentCheckController.post
  );
  app.get(PageUrls.CONTACT_ACAS, app.locals.container.cradle.contactAcasController.get);
  app.get(PageUrls.DOB_DETAILS, app.locals.container.cradle.dobController.get);
  app.post(PageUrls.DOB_DETAILS, app.locals.container.cradle.dobController.post);
  app.get(PageUrls.SEX_AND_TITLE, app.locals.container.cradle.sexAndTitleController.get);
  app.post(PageUrls.SEX_AND_TITLE, app.locals.container.cradle.sexAndTitleController.post);
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
  app.get(PageUrls.AVERAGE_WEEKLY_HOURS, app.locals.container.cradle.averageWeeklyHoursController.get);
  app.post(PageUrls.AVERAGE_WEEKLY_HOURS, app.locals.container.cradle.averageWeeklyHoursController.post);
  app.get(PageUrls.PAY, app.locals.container.cradle.payController.get);
  app.post(PageUrls.PAY, app.locals.container.cradle.payController.post);
  app.get(PageUrls.BENEFITS, app.locals.container.cradle.benefitsController.get);
  app.post(PageUrls.BENEFITS, app.locals.container.cradle.benefitsController.post);
  app.get(PageUrls.REASONABLE_ADJUSTMENTS, app.locals.container.cradle.reasonableAdjustmentsController.get);
  app.post(PageUrls.REASONABLE_ADJUSTMENTS, app.locals.container.cradle.reasonableAdjustmentsController.post);
  app.get(PageUrls.NEW_JOB, app.locals.container.cradle.newJobController.get);
  app.post(PageUrls.NEW_JOB, app.locals.container.cradle.newJobController.post);
  app.get(PageUrls.NEW_JOB_PAY, app.locals.container.cradle.newJobPayController.get);
  app.post(PageUrls.NEW_JOB_PAY, app.locals.container.cradle.newJobPayController.post);
  app.get(PageUrls.NEW_JOB_START_DATE, app.locals.container.cradle.newJobStartDateController.get);
  app.post(PageUrls.NEW_JOB_START_DATE, app.locals.container.cradle.newJobStartDateController.post);
  app.get(PageUrls.CLAIM_SUBMITTED, app.locals.container.cradle.claimSubmittedController.get);
  app.get(PageUrls.CHECK_ANSWERS, app.locals.container.cradle.checkYourAnswersController.get);
  app.get(PageUrls.END_DATE, app.locals.container.cradle.endDateController.get);
  app.post(PageUrls.END_DATE, app.locals.container.cradle.endDateController.post);
  app.get(PageUrls.CLAIM_TYPE_DISCRIMINATION, app.locals.container.cradle.claimTypeDiscriminationController.get);
  app.post(PageUrls.CLAIM_TYPE_DISCRIMINATION, app.locals.container.cradle.claimTypeDiscriminationController.post);
  app.get(PageUrls.CLAIM_TYPE_PAY, app.locals.container.cradle.claimTypePayController.get);
  app.post(PageUrls.CLAIM_TYPE_PAY, app.locals.container.cradle.claimTypePayController.post);
  app.get(PageUrls.DESCRIBE_WHAT_HAPPENED, app.locals.container.cradle.describeWhatHappenedController.get);
  app.post(
    PageUrls.DESCRIBE_WHAT_HAPPENED,
    handleUploads.single('claimSummaryFileName'),
    app.locals.container.cradle.describeWhatHappenedController.post
  );
  app.get(PageUrls.TELL_US_WHAT_YOU_WANT, app.locals.container.cradle.tellUsWhatYouWantController.get);
  app.post(PageUrls.TELL_US_WHAT_YOU_WANT, app.locals.container.cradle.tellUsWhatYouWantController.post);
  app.get(PageUrls.COMPENSATION, app.locals.container.cradle.compensationController.get);
  app.post(PageUrls.COMPENSATION, app.locals.container.cradle.compensationController.post);
  app.get(PageUrls.TRIBUNAL_RECOMMENDATION, app.locals.container.cradle.tribunalRecommendationController.get);
  app.post(PageUrls.TRIBUNAL_RECOMMENDATION, app.locals.container.cradle.tribunalRecommendationController.post);
  app.get(PageUrls.WHISTLEBLOWING_CLAIMS, app.locals.container.cradle.whistleblowingClaimsController.get);
  app.post(PageUrls.WHISTLEBLOWING_CLAIMS, app.locals.container.cradle.whistleblowingClaimsController.post);
  app.get(PageUrls.CLAIM_DETAILS_CHECK, app.locals.container.cradle.claimDetailsCheckController.get);
  app.post(PageUrls.CLAIM_DETAILS_CHECK, app.locals.container.cradle.claimDetailsCheckController.post);
  app.get(Urls.DOWNLOAD_CLAIM, app.locals.container.cradle.downloadClaimController.get);
  app.get(PageUrls.WORK_POSTCODE, app.locals.container.cradle.workPostcodeController.get);
  app.post(PageUrls.WORK_POSTCODE, app.locals.container.cradle.workPostcodeController.post);
  app.get(InterceptPaths.CHANGE_DETAILS, app.locals.container.cradle.changeDetailsController.get);
  app.get(Urls.EXTEND_SESSION, app.locals.container.cradle.sessionTimeoutController.getExtendSession);
  app.get(InterceptPaths.SUBMIT_CASE, app.locals.container.cradle.submitClaimController.get);
  app.get(PageUrls.CLAIMANT_APPLICATIONS, app.locals.container.cradle.claimantApplicationsController.get);
  app.get(PageUrls.SELECTED_APPLICATION, app.locals.container.cradle.selectedApplicationController.get);
  app.get(PageUrls.CITIZEN_HUB, app.locals.container.cradle.citizenHubController.get);
  app.get(PageUrls.CLAIM_DETAILS, app.locals.container.cradle.claimDetailsController.get);
  app.get(PageUrls.CITIZEN_HUB_DOCUMENT, app.locals.container.cradle.citizenHubDocumentController.get);
  app.get(PageUrls.GET_CASE_DOCUMENT, app.locals.container.cradle.caseDocumentController.get);
  app.get(
    Urls.INFO,
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

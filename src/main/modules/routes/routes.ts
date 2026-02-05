/* eslint import/no-named-as-default: "off" */

import os from 'os';

import { infoRequestHandler } from '@hmcts/info-provider';
import { Application } from 'express';
import rateLimit from 'express-rate-limit';
import multer, { FileFilterCallback } from 'multer';

import AboutHearingDocumentsController from '../../controllers/AboutHearingDocumentsController';
import AcasCertNumController from '../../controllers/AcasCertNumController';
import AcasMultipleController from '../../controllers/AcasMultipleController';
import AccessibilityStatementController from '../../controllers/AccessibilityStatementController';
import AddressDetailsController from '../../controllers/AddressDetailsController';
import AddressLookupController from '../../controllers/AddressLookupController';
import AddressPostCodeEnterController from '../../controllers/AddressPostCodeEnterController';
import AddressPostCodeSelectController from '../../controllers/AddressPostCodeSelectController';
import AgreeingDocumentsForHearingController from '../../controllers/AgreeingDocumentsForHearingController';
import AllDocumentsController from '../../controllers/AllDocumentsController';
import AllJudgmentsController from '../../controllers/AllJudgmentsController';
import ApplicationCompleteController from '../../controllers/ApplicationCompleteController';
import ApplicationDetailsController from '../../controllers/ApplicationDetailsController';
import AppointLegalRepController from '../../controllers/AppointLegalRepController';
import AttachmentController from '../../controllers/AttachmentController';
import AverageWeeklyHoursController from '../../controllers/AverageWeeklyHoursController';
import BenefitsController from '../../controllers/BenefitsController';
import BundlesCompletedController from '../../controllers/BundlesCompletedController';
import BundlesDocsForHearingCYAController from '../../controllers/BundlesDocsForHearingCYAController';
import CaseDocumentController from '../../controllers/CaseDocumentController';
import CaseNumberController from '../../controllers/CaseNumberController';
import ChangeDetailsController from '../../controllers/ChangeDetailsController';
import ChangeLegalRepresentativeController from '../../controllers/ChangeLegalRepresentativeController';
import CheckYourAnswersController from '../../controllers/CheckYourAnswersController';
import ChecklistController from '../../controllers/ChecklistController';
import ClaimDetailsCheckController from '../../controllers/ClaimDetailsCheckController';
import ClaimDetailsController from '../../controllers/ClaimDetailsController';
import ClaimJurisdictionSelectionController from '../../controllers/ClaimJurisdictionSelectionController';
import ClaimSavedController from '../../controllers/ClaimSavedController';
import ClaimSubmittedController from '../../controllers/ClaimSubmittedController';
import ClaimTypeDiscriminationController from '../../controllers/ClaimTypeDiscriminationController';
import ClaimTypePayController from '../../controllers/ClaimTypePayController';
import ClaimantApplicationsController from '../../controllers/ClaimantApplicationsController';
import CompensationController from '../../controllers/CompensationController';
import ContactAcasController from '../../controllers/ContactAcasController';
import ContactTheTribunalCYAController from '../../controllers/ContactTheTribunalCYAController';
import ContactTheTribunalCYANotSystemUserController from '../../controllers/ContactTheTribunalCYANotSystemUserController';
import ContactTheTribunalController from '../../controllers/ContactTheTribunalController';
import ContactTheTribunalFileController from '../../controllers/ContactTheTribunalFileController';
import ContactTheTribunalSelectedController from '../../controllers/ContactTheTribunalSelectedController';
import CookiePreferencesController from '../../controllers/CookiePreferencesController';
import CopyToOtherPartyController from '../../controllers/CopyToOtherPartyController';
import CopyToOtherPartyNotSystemUserController from '../../controllers/CopyToOtherPartyNotSystemUserController';
import DescribeWhatHappenedController from '../../controllers/DescribeWhatHappenedController';
import DobController from '../../controllers/DobController';
import DownloadClaimController from '../../controllers/DownloadClaimController';
import EmploymentAndRespondentCheckController from '../../controllers/EmploymentAndRespondentCheckController';
import EndDateController from '../../controllers/EndDateController';
import { GeneralCorrespondenceListController } from '../../controllers/GeneralCorrespondenceListController';
import GeneralCorrespondenceNotificationDetailsController from '../../controllers/GeneralCorrespondenceNotificationDetailsController';
import HearingDetailsController from '../../controllers/HearingDetailsController';
import HearingDocumentFileController from '../../controllers/HearingDocumentFileController';
import HearingDocumentUploadController from '../../controllers/HearingDocumentUploadController';
import HomeController from '../../controllers/HomeController';
import JobTitleController from '../../controllers/JobTitleController';
import JudgmentDetailsController from '../../controllers/JudgmentDetailsController';
import LinkedCasesController from '../../controllers/LinkedCasesController';
import LipOrRepController from '../../controllers/LipOrRepController';
import MakingClaimAsLegalRepController from '../../controllers/MakingClaimAsLegalRepController';
import NewAccountLandingController from '../../controllers/NewAccountLandingController';
import NewJobController from '../../controllers/NewJobController';
import NewJobPayController from '../../controllers/NewJobPayController';
import NewJobStartDateController from '../../controllers/NewJobStartDateController';
import NoAcasNumberController from '../../controllers/NoAcasNumberController';
import NoticeEndController from '../../controllers/NoticeEndController';
import NoticeLengthController from '../../controllers/NoticeLengthController';
import NoticePeriodController from '../../controllers/NoticePeriodController';
import NoticeTypeController from '../../controllers/NoticeTypeController';
import PastEmployerController from '../../controllers/PastEmployerController';
import PayController from '../../controllers/PayController';
import PcqController from '../../controllers/PcqController';
import PensionController from '../../controllers/PensionController';
import PersonalDetailsCheckController from '../../controllers/PersonalDetailsCheckController';
import PlaceOfWorkController from '../../controllers/PlaceOfWorkController';
import PrepareDocumentsController from '../../controllers/PrepareDocumentsController';
import ReasonableAdjustmentsController from '../../controllers/ReasonableAdjustmentsController';
import RespondToApplicationCompleteController from '../../controllers/RespondToApplicationCompleteController';
import RespondToApplicationController from '../../controllers/RespondToApplicationController';
import RespondToTribunalResponseController from '../../controllers/RespondToTribunalResponseController';
import RespondentAddInCheckAnswerController from '../../controllers/RespondentAddInCheckAnswerController';
import RespondentAddressController from '../../controllers/RespondentAddressController';
import RespondentAddressNonUkController from '../../controllers/RespondentAddressNonUkController';
import RespondentApplicationCYAController from '../../controllers/RespondentApplicationCYAController';
import RespondentApplicationDetailsController from '../../controllers/RespondentApplicationDetailsController';
import RespondentApplicationsController from '../../controllers/RespondentApplicationsController';
import RespondentContactDetailsController from '../../controllers/RespondentContactDetailsController';
import RespondentDetailsCheckController from '../../controllers/RespondentDetailsCheckController';
import RespondentNameController from '../../controllers/RespondentNameController';
import RespondentPostCodeEnterController from '../../controllers/RespondentPostCodeEnterController';
import RespondentPostCodeSelectController from '../../controllers/RespondentPostCodeSelectController';
import RespondentRemoveController from '../../controllers/RespondentRemoveController';
import RespondentSupportingMaterialController from '../../controllers/RespondentSupportingMaterialController';
import RespondentSupportingMaterialFileController from '../../controllers/RespondentSupportingMaterialFileController';
import ReturnToExistingController from '../../controllers/ReturnToExistingController';
import Rule92HoldingPageController from '../../controllers/Rule92HoldingPageController';
import SelectedApplicationController from '../../controllers/SelectedApplicationController';
import SessionTimeoutController from '../../controllers/SessionTimeoutController';
import SexAndTitleController from '../../controllers/SexAndTitleController';
import SingleOrMultipleController from '../../controllers/SingleOrMultipleController';
import StartDateController from '../../controllers/StartDateController';
import StepsToMakingYourClaimController from '../../controllers/StepsToMakingYourClaimController';
import StillWorkingController from '../../controllers/StillWorkingController';
import StoreRespondentController from '../../controllers/StoreRespondentController';
import StoreTseController from '../../controllers/StoreTseController';
import StoredApplicationConfirmationController from '../../controllers/StoredApplicationConfirmationController';
import StoredResponseAppConfirmationController from '../../controllers/StoredResponseAppConfirmationController';
import StoredResponseTribunalConfirmationController from '../../controllers/StoredResponseTribunalConfirmationController';
import StoredToSubmitCompleteController from '../../controllers/StoredToSubmitCompleteController';
import StoredToSubmitController from '../../controllers/StoredToSubmitController';
import StoredToSubmitResponseController from '../../controllers/StoredToSubmitResponseController';
import StoredToSubmitTribunalController from '../../controllers/StoredToSubmitTribunalController';
import SubmitBundlesHearingDocsCYAController from '../../controllers/SubmitBundlesHearingDocsCYAController';
import SubmitClaimController from '../../controllers/SubmitClaimController';
import SubmitRespondentController from '../../controllers/SubmitRespondentController';
import SubmitTseController from '../../controllers/SubmitTribunalCYAController';
import TelNumberController from '../../controllers/TelNumberController';
import TellUsWhatYouWantController from '../../controllers/TellUsWhatYouWantController';
import TribunalOrderOrRequestDetailsController from '../../controllers/TribunalOrderOrRequestDetailsController';
import { TribunalOrdersAndRequestsController } from '../../controllers/TribunalOrdersAndRequestsController';
import TribunalRecommendationController from '../../controllers/TribunalRecommendationController';
import TribunalRespondToOrderController from '../../controllers/TribunalRespondToOrderController';
import TribunalResponseCYAController from '../../controllers/TribunalResponseCYAController';
import TribunalResponseCYANotSystemUserController from '../../controllers/TribunalResponseCYANotSystemUserController';
import TribunalResponseCompletedController from '../../controllers/TribunalResponseCompletedController';
import TribunalResponseStoreController from '../../controllers/TribunalResponseStoreController';
import TribunalResponseSubmitController from '../../controllers/TribunalResponseSubmitController';
import TypeOfClaimController from '../../controllers/TypeOfClaimController';
import UpdatePreferenceController from '../../controllers/UpdatePreferenceController';
import ValidNoAcasReasonController from '../../controllers/ValidNoAcasReasonController';
import VideoHearingsController from '../../controllers/VideoHearingsController';
import WhistleblowingClaimsController from '../../controllers/WhistleblowingClaimsController';
import WorkAddressController from '../../controllers/WorkAddressController';
import WorkPostCodeEnterController from '../../controllers/WorkPostCodeEnterController';
import WorkPostCodeSelectController from '../../controllers/WorkPostCodeSelectController';
import YourAppsToTheTribunalController from '../../controllers/YourAppsToTheTribunalController';
import YourDetailsCYAController from '../../controllers/YourDetailsCYAController';
import YourDetailsFormController from '../../controllers/YourDetailsFormController';
import CitizenHubController from '../../controllers/citizen-hub/CitizenHubController';
import CitizenHubDocumentController from '../../controllers/citizen-hub/CitizenHubDocumentController';
import CitizenHubResponseFromRespondentController from '../../controllers/citizen-hub/CitizenHubResponseFromRespondentController';
import { AppRequest } from '../../definitions/appRequest';
import { FILE_SIZE_LIMIT, InterceptPaths, PageUrls, Urls } from '../../definitions/constants';

const handleUploads = multer({
  limits: {
    fileSize: FILE_SIZE_LIMIT,
  },
  fileFilter: (req: AppRequest, file: Express.Multer.File, callback: FileFilterCallback) => {
    req.fileTooLarge = parseInt(req.headers['content-length']) > FILE_SIZE_LIMIT;
    return callback(null, !req.fileTooLarge);
  },
});

const describeWhatHappenedLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: 'Too many requests from this IP, please try again later.',
});

export class Routes {
  public enableFor(app: Application): void {
    // Singleton controllers:
    const describeWhatHappenedController = new DescribeWhatHappenedController();

    app.get(Urls.PCQ, new PcqController().get);
    app.get(PageUrls.HOME, new HomeController().get);
    app.get(PageUrls.CHECKLIST, new ChecklistController().get);
    app.get(PageUrls.NEW_ACCOUNT_LANDING, new NewAccountLandingController().get);
    app.get(PageUrls.PERSONAL_DETAILS_CHECK, new PersonalDetailsCheckController().get);
    app.post(PageUrls.PERSONAL_DETAILS_CHECK, new PersonalDetailsCheckController().post);
    app.get(PageUrls.LIP_OR_REPRESENTATIVE, new LipOrRepController().get);
    app.post(PageUrls.LIP_OR_REPRESENTATIVE, new LipOrRepController().post);
    app.get(PageUrls.MAKING_CLAIM_AS_LEGAL_REPRESENTATIVE, new MakingClaimAsLegalRepController().get);
    app.get(PageUrls.SINGLE_OR_MULTIPLE_CLAIM, new SingleOrMultipleController().get);
    app.post(PageUrls.SINGLE_OR_MULTIPLE_CLAIM, new SingleOrMultipleController().post);
    app.get(PageUrls.ACAS_MULTIPLE_CLAIM, new AcasMultipleController().get);
    app.post(PageUrls.ACAS_MULTIPLE_CLAIM, new AcasMultipleController().post);
    app.get(PageUrls.VALID_ACAS_REASON, new ValidNoAcasReasonController().get);
    app.post(PageUrls.VALID_ACAS_REASON, new ValidNoAcasReasonController().post);
    app.get(PageUrls.COOKIE_PREFERENCES, new CookiePreferencesController().get);
    app.get(PageUrls.ACCESSIBILITY_STATEMENT, new AccessibilityStatementController().get);
    app.get(PageUrls.RESPONDENT_REST_PREFIX + PageUrls.RESPONDENT_NAME, new RespondentNameController().get);
    app.post(PageUrls.RESPONDENT_REST_PREFIX + PageUrls.RESPONDENT_NAME, new RespondentNameController().post);
    app.get(PageUrls.RESPONDENT_REST_PREFIX + PageUrls.RESPONDENT_ADDRESS, new RespondentAddressController().get);
    app.post(PageUrls.RESPONDENT_REST_PREFIX + PageUrls.RESPONDENT_ADDRESS, new RespondentAddressController().post);
    app.get(
      PageUrls.RESPONDENT_REST_PREFIX + PageUrls.RESPONDENT_ADDRESS_NON_UK,
      new RespondentAddressNonUkController().get
    );
    app.post(
      PageUrls.RESPONDENT_REST_PREFIX + PageUrls.RESPONDENT_ADDRESS_NON_UK,
      new RespondentAddressNonUkController().post
    );
    app.get(PageUrls.RESPONDENT_REST_PREFIX + PageUrls.WORK_ADDRESS, new WorkAddressController().get);
    app.post(PageUrls.RESPONDENT_REST_PREFIX + PageUrls.WORK_ADDRESS, new WorkAddressController().post);
    app.get(PageUrls.RESPONDENT_REST_PREFIX + PageUrls.PLACE_OF_WORK, new PlaceOfWorkController().get);
    app.post(PageUrls.RESPONDENT_REST_PREFIX + PageUrls.PLACE_OF_WORK, new PlaceOfWorkController().post);
    app.get(PageUrls.RESPONDENT_REST_PREFIX + PageUrls.ACAS_CERT_NUM, new AcasCertNumController().get);
    app.post(PageUrls.RESPONDENT_REST_PREFIX + PageUrls.ACAS_CERT_NUM, new AcasCertNumController().post);
    app.get(PageUrls.RESPONDENT_REST_PREFIX + PageUrls.NO_ACAS_NUMBER, new NoAcasNumberController().get);
    app.post(PageUrls.RESPONDENT_REST_PREFIX + PageUrls.NO_ACAS_NUMBER, new NoAcasNumberController().post);
    app.get(PageUrls.RESPONDENT_DETAILS_CHECK, new RespondentDetailsCheckController().get);
    app.post(PageUrls.RESPONDENT_DETAILS_CHECK, new RespondentDetailsCheckController().post);
    app.get(PageUrls.RESPONDENT_ADD_REDIRECT, new RespondentAddInCheckAnswerController().get);
    app.get(PageUrls.RESPONDENT_REST_PREFIX + PageUrls.RESPONDENT_REMOVE, new RespondentRemoveController().get);
    app.get(PageUrls.EMPLOYMENT_RESPONDENT_TASK_CHECK, new EmploymentAndRespondentCheckController().get);
    app.post(PageUrls.EMPLOYMENT_RESPONDENT_TASK_CHECK, new EmploymentAndRespondentCheckController().post);
    app.get(PageUrls.CONTACT_ACAS, new ContactAcasController().get);

    app.get(PageUrls.DOB_DETAILS, new DobController().get);
    app.post(PageUrls.DOB_DETAILS, new DobController().post);
    app.get(PageUrls.SEX_AND_TITLE, new SexAndTitleController().get);
    app.post(PageUrls.SEX_AND_TITLE, new SexAndTitleController().post);
    app.get(PageUrls.ADDRESS_DETAILS, new AddressDetailsController().get);
    app.post(PageUrls.ADDRESS_DETAILS, new AddressDetailsController().post);
    app.get(PageUrls.TELEPHONE_NUMBER, new TelNumberController().get);
    app.post(PageUrls.TELEPHONE_NUMBER, new TelNumberController().post);
    app.get(PageUrls.VIDEO_HEARINGS, new VideoHearingsController().get);
    app.post(PageUrls.VIDEO_HEARINGS, new VideoHearingsController().post);
    app.get(PageUrls.CLAIM_STEPS, new StepsToMakingYourClaimController().get);
    app.get(PageUrls.CLAIM_SAVED, new ClaimSavedController().get);
    app.get(PageUrls.RETURN_TO_EXISTING, new ReturnToExistingController().get);
    app.post(PageUrls.RETURN_TO_EXISTING, new ReturnToExistingController().post);
    app.get(PageUrls.CASE_NUMBER_CHECK, new CaseNumberController().get);
    app.post(PageUrls.CASE_NUMBER_CHECK, new CaseNumberController().post);
    app.get(PageUrls.YOUR_DETAILS_FORM, new YourDetailsFormController().get);
    app.post(PageUrls.YOUR_DETAILS_FORM, new YourDetailsFormController().post);
    app.get(PageUrls.UPDATE_PREFERENCES, new UpdatePreferenceController().get);
    app.post(PageUrls.UPDATE_PREFERENCES, new UpdatePreferenceController().post);
    app.get(PageUrls.JOB_TITLE, new JobTitleController().get);
    app.post(PageUrls.JOB_TITLE, new JobTitleController().post);
    app.get(PageUrls.STILL_WORKING, new StillWorkingController().get);
    app.post(PageUrls.STILL_WORKING, new StillWorkingController().post);
    app.get(PageUrls.TYPE_OF_CLAIM, new TypeOfClaimController().get);
    app.post(PageUrls.TYPE_OF_CLAIM, new TypeOfClaimController().post);
    app.get(PageUrls.PAST_EMPLOYER, new PastEmployerController().get);
    app.post(PageUrls.PAST_EMPLOYER, new PastEmployerController().post);
    app.post(PageUrls.ADDRESS_LOOK_UP, new AddressLookupController().post);
    app.get(PageUrls.NOTICE_PERIOD, new NoticePeriodController().get);
    app.post(PageUrls.NOTICE_PERIOD, new NoticePeriodController().post);
    app.get(PageUrls.NOTICE_TYPE, new NoticeTypeController().get);
    app.post(PageUrls.NOTICE_TYPE, new NoticeTypeController().post);
    app.get(PageUrls.NOTICE_LENGTH, new NoticeLengthController().get);
    app.post(PageUrls.NOTICE_LENGTH, new NoticeLengthController().post);
    app.get(PageUrls.PENSION, new PensionController().get);
    app.post(PageUrls.PENSION, new PensionController().post);
    app.get(PageUrls.START_DATE, new StartDateController().get);
    app.post(PageUrls.START_DATE, new StartDateController().post);
    app.get(PageUrls.NOTICE_END, new NoticeEndController().get);
    app.post(PageUrls.NOTICE_END, new NoticeEndController().post);
    app.get(PageUrls.AVERAGE_WEEKLY_HOURS, new AverageWeeklyHoursController().get);
    app.post(PageUrls.AVERAGE_WEEKLY_HOURS, new AverageWeeklyHoursController().post);
    app.get(PageUrls.PAY, new PayController().get);
    app.post(PageUrls.PAY, new PayController().post);
    app.get(PageUrls.BENEFITS, new BenefitsController().get);
    app.post(PageUrls.BENEFITS, new BenefitsController().post);
    app.get(PageUrls.REASONABLE_ADJUSTMENTS, new ReasonableAdjustmentsController().get);
    app.post(PageUrls.REASONABLE_ADJUSTMENTS, new ReasonableAdjustmentsController().post);
    app.get(PageUrls.NEW_JOB, new NewJobController().get);
    app.post(PageUrls.NEW_JOB, new NewJobController().post);
    app.get(PageUrls.NEW_JOB_PAY, new NewJobPayController().get);
    app.post(PageUrls.NEW_JOB_PAY, new NewJobPayController().post);
    app.get(PageUrls.NEW_JOB_START_DATE, new NewJobStartDateController().get);
    app.post(PageUrls.NEW_JOB_START_DATE, new NewJobStartDateController().post);
    app.get(PageUrls.CLAIM_SUBMITTED, new ClaimSubmittedController().get);
    app.get(PageUrls.CHECK_ANSWERS, new CheckYourAnswersController().get);
    app.get(PageUrls.END_DATE, new EndDateController().get);
    app.post(PageUrls.END_DATE, new EndDateController().post);
    app.get(PageUrls.CLAIM_TYPE_DISCRIMINATION, new ClaimTypeDiscriminationController().get);
    app.post(PageUrls.CLAIM_TYPE_DISCRIMINATION, new ClaimTypeDiscriminationController().post);
    app.get(PageUrls.CLAIM_TYPE_PAY, new ClaimTypePayController().get);
    app.post(PageUrls.CLAIM_TYPE_PAY, new ClaimTypePayController().post);
    app.get(PageUrls.DESCRIBE_WHAT_HAPPENED, describeWhatHappenedController.get);
    app.post(
      PageUrls.DESCRIBE_WHAT_HAPPENED,
      describeWhatHappenedLimiter,
      handleUploads.single('claimSummaryFileName'),
      describeWhatHappenedController.post
    );
    app.get(PageUrls.TELL_US_WHAT_YOU_WANT, new TellUsWhatYouWantController().get);
    app.post(PageUrls.TELL_US_WHAT_YOU_WANT, new TellUsWhatYouWantController().post);
    app.get(PageUrls.COMPENSATION, new CompensationController().get);
    app.post(PageUrls.COMPENSATION, new CompensationController().post);
    app.get(PageUrls.TRIBUNAL_RECOMMENDATION, new TribunalRecommendationController().get);
    app.post(PageUrls.TRIBUNAL_RECOMMENDATION, new TribunalRecommendationController().post);
    app.get(PageUrls.WHISTLEBLOWING_CLAIMS, new WhistleblowingClaimsController().get);
    app.post(PageUrls.WHISTLEBLOWING_CLAIMS, new WhistleblowingClaimsController().post);
    app.get(PageUrls.LINKED_CASES, new LinkedCasesController().get);
    app.post(PageUrls.LINKED_CASES, new LinkedCasesController().post);
    app.get(PageUrls.CLAIM_DETAILS_CHECK, new ClaimDetailsCheckController().get);
    app.post(PageUrls.CLAIM_DETAILS_CHECK, new ClaimDetailsCheckController().post);
    app.get(Urls.DOWNLOAD_CLAIM, new DownloadClaimController().get);
    app.get(PageUrls.CLAIM_JURISDICTION_SELECTION, new ClaimJurisdictionSelectionController().get);
    app.post(PageUrls.CLAIM_JURISDICTION_SELECTION, new ClaimJurisdictionSelectionController().post);
    app.get(InterceptPaths.CHANGE_DETAILS, new ChangeDetailsController().get);
    app.get(Urls.EXTEND_SESSION, new SessionTimeoutController().getExtendSession);
    app.get(InterceptPaths.SUBMIT_CASE, new SubmitClaimController().get);
    app.get(PageUrls.CLAIMANT_APPLICATIONS, new ClaimantApplicationsController().get);
    app.get(PageUrls.SELECTED_APPLICATION, new SelectedApplicationController().get);
    app.get(PageUrls.CITIZEN_HUB, new CitizenHubController().get);
    app.get(PageUrls.CLAIM_DETAILS, new ClaimDetailsController().get);
    app.get(PageUrls.CITIZEN_HUB_DOCUMENT, new CitizenHubDocumentController().get);
    app.get(PageUrls.CITIZEN_HUB_DOCUMENT_RESPONSE_RESPONDENT, new CitizenHubResponseFromRespondentController().get);
    app.get(PageUrls.RESPONDENT_CONTACT_DETAILS, new RespondentContactDetailsController().get);
    app.get(PageUrls.GET_CASE_DOCUMENT, new CaseDocumentController().get);
    app.get(PageUrls.GET_SUPPORTING_MATERIAL, new AttachmentController().get);
    app.get(PageUrls.CONTACT_THE_TRIBUNAL, new ContactTheTribunalController().get);
    app.get(PageUrls.COPY_TO_OTHER_PARTY, new CopyToOtherPartyController().get);
    app.post(PageUrls.COPY_TO_OTHER_PARTY, new CopyToOtherPartyController().post);
    app.get(PageUrls.TRIBUNAL_CONTACT_SELECTED, new ContactTheTribunalSelectedController().get);
    app.get(PageUrls.CONTACT_THE_TRIBUNAL_CYA, new ContactTheTribunalCYAController().get);
    app.get(InterceptPaths.SUBMIT_TRIBUNAL_CYA, new SubmitTseController().get);
    app.get(InterceptPaths.SUBMIT_RESPONDENT_CYA, new SubmitRespondentController().get);
    app.get(InterceptPaths.SUBMIT_BUNDLES_HEARING_DOCS_CYA, new SubmitBundlesHearingDocsCYAController().get);
    app.get(PageUrls.APPLICATION_COMPLETE, new ApplicationCompleteController().get);
    app.post(
      PageUrls.TRIBUNAL_CONTACT_SELECTED,
      handleUploads.single('contactApplicationFile'),
      new ContactTheTribunalSelectedController().post
    );
    app.get(PageUrls.REMOVE_FILE, new ContactTheTribunalFileController().get);
    app.post(PageUrls.TRIBUNAL_CONTACT_SELECTED, new ContactTheTribunalSelectedController().post);
    app.get(PageUrls.RESPOND_TO_APPLICATION_COMPLETE, new RespondToApplicationCompleteController().get);
    app.get(PageUrls.ADDRESS_POSTCODE_SELECT, new AddressPostCodeSelectController().get);
    app.post(PageUrls.ADDRESS_POSTCODE_SELECT, new AddressPostCodeSelectController().post);
    app.get(PageUrls.ADDRESS_POSTCODE_ENTER, new AddressPostCodeEnterController().get);
    app.post(PageUrls.ADDRESS_POSTCODE_ENTER, new AddressPostCodeEnterController().post);
    app.get(
      PageUrls.RESPONDENT_REST_PREFIX + PageUrls.ADDRESS_POSTCODE_ENTER,
      new AddressPostCodeEnterController().get
    );
    app.post(
      PageUrls.RESPONDENT_REST_PREFIX + PageUrls.ADDRESS_POSTCODE_ENTER,
      new AddressPostCodeEnterController().post
    );
    app.get(
      PageUrls.RESPONDENT_REST_PREFIX + PageUrls.ADDRESS_POSTCODE_SELECT,
      new AddressPostCodeSelectController().get
    );
    app.post(
      PageUrls.RESPONDENT_REST_PREFIX + PageUrls.ADDRESS_POSTCODE_SELECT,
      new AddressPostCodeSelectController().post
    );

    app.get(PageUrls.RESPONDENT_POSTCODE_SELECT, new RespondentPostCodeSelectController().get);
    app.post(PageUrls.RESPONDENT_POSTCODE_SELECT, new RespondentPostCodeSelectController().post);
    app.get(PageUrls.RESPONDENT_POSTCODE_ENTER, new RespondentPostCodeEnterController().get);
    app.post(PageUrls.RESPONDENT_POSTCODE_ENTER, new RespondentPostCodeEnterController().post);
    app.get(
      PageUrls.RESPONDENT_REST_PREFIX + PageUrls.RESPONDENT_POSTCODE_ENTER,
      new RespondentPostCodeEnterController().get
    );
    app.post(
      PageUrls.RESPONDENT_REST_PREFIX + PageUrls.RESPONDENT_POSTCODE_ENTER,
      new RespondentPostCodeEnterController().post
    );
    app.get(
      PageUrls.RESPONDENT_REST_PREFIX + PageUrls.RESPONDENT_POSTCODE_SELECT,
      new RespondentPostCodeSelectController().get
    );
    app.post(
      PageUrls.RESPONDENT_REST_PREFIX + PageUrls.RESPONDENT_POSTCODE_SELECT,
      new RespondentPostCodeSelectController().post
    );

    // R92 - Non-system user - Store
    app.get(PageUrls.COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER, new CopyToOtherPartyNotSystemUserController().get);
    app.post(PageUrls.COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER, new CopyToOtherPartyNotSystemUserController().post);
    app.get(PageUrls.CONTACT_THE_TRIBUNAL_CYA_NOT_SYSTEM_USER, new ContactTheTribunalCYANotSystemUserController().get);
    app.get(PageUrls.TRIBUNAL_RESPONSE_CYA_NOT_SYSTEM_USER, new TribunalResponseCYANotSystemUserController().get);
    app.get(InterceptPaths.STORE_TRIBUNAL_CYA, new StoreTseController().get);
    app.get(InterceptPaths.STORE_RESPONDENT_CYA, new StoreRespondentController().get);
    app.get(InterceptPaths.TRIBUNAL_RESPONSE_STORE_CYA, new TribunalResponseStoreController().get);
    app.get(PageUrls.STORED_APPLICATION_CONFIRMATION, new StoredApplicationConfirmationController().get);
    app.get(PageUrls.STORED_RESPONSE_APPLICATION_CONFIRMATION, new StoredResponseAppConfirmationController().get);
    app.get(PageUrls.STORED_RESPONSE_TRIBUNAL_CONFIRMATION, new StoredResponseTribunalConfirmationController().get);
    app.get(PageUrls.STORED_TO_SUBMIT, new StoredToSubmitController().get);
    app.post(PageUrls.STORED_TO_SUBMIT, new StoredToSubmitController().post);
    app.get(PageUrls.STORED_TO_SUBMIT_RESPONSE, new StoredToSubmitResponseController().get);
    app.post(PageUrls.STORED_TO_SUBMIT_RESPONSE, new StoredToSubmitResponseController().post);
    app.get(PageUrls.STORED_TO_SUBMIT_TRIBUNAL, new StoredToSubmitTribunalController().get);
    app.post(PageUrls.STORED_TO_SUBMIT_TRIBUNAL, new StoredToSubmitTribunalController().post);
    app.get(PageUrls.STORED_TO_SUBMIT_COMPLETE, new StoredToSubmitCompleteController().get);

    app.get(PageUrls.WORK_POSTCODE_SELECT, new WorkPostCodeSelectController().get);
    app.post(PageUrls.WORK_POSTCODE_SELECT, new WorkPostCodeSelectController().post);
    app.get(PageUrls.WORK_POSTCODE_ENTER, new WorkPostCodeEnterController().get);
    app.post(PageUrls.WORK_POSTCODE_ENTER, new WorkPostCodeEnterController().post);
    app.get(PageUrls.RESPONDENT_REST_PREFIX + PageUrls.WORK_POSTCODE_ENTER, new WorkPostCodeEnterController().get);
    app.post(PageUrls.RESPONDENT_REST_PREFIX + PageUrls.WORK_POSTCODE_ENTER, new WorkPostCodeEnterController().post);
    app.get(PageUrls.RESPONDENT_REST_PREFIX + PageUrls.WORK_POSTCODE_SELECT, new WorkPostCodeSelectController().get);
    app.post(PageUrls.RESPONDENT_REST_PREFIX + PageUrls.WORK_POSTCODE_SELECT, new WorkPostCodeSelectController().post);
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
    app.get(PageUrls.APPLICATION_DETAILS, new ApplicationDetailsController().get);
    app.get(PageUrls.YOUR_APPLICATIONS, new YourAppsToTheTribunalController().get);
    app.get(PageUrls.RESPOND_TO_APPLICATION_SELECTED, new RespondToApplicationController().get);
    app.post(PageUrls.RESPOND_TO_APPLICATION_SELECTED, new RespondToApplicationController().post);
    app.get(PageUrls.RESPONDENT_APPLICATIONS, new RespondentApplicationsController().get);
    app.get(PageUrls.RESPONDENT_APPLICATION_DETAILS, new RespondentApplicationDetailsController().get);

    app.get(PageUrls.RESPONDENT_SUPPORTING_MATERIAL, new RespondentSupportingMaterialController().get);
    app.post(
      PageUrls.RESPONDENT_SUPPORTING_MATERIAL,
      handleUploads.single('supportingMaterialFile'),
      new RespondentSupportingMaterialController().post
    );
    app.get(PageUrls.REMOVE_SUPPORTING_MATERIAL, new RespondentSupportingMaterialFileController().get);

    app.get(PageUrls.HEARING_DOCUMENT_UPLOAD, new HearingDocumentUploadController().get);
    app.post(
      PageUrls.HEARING_DOCUMENT_UPLOAD,
      handleUploads.single('hearingDocument'),
      new HearingDocumentUploadController().post
    );
    app.get(PageUrls.HEARING_DOCUMENT_REMOVE, new HearingDocumentFileController().get);

    app.get(PageUrls.RESPONDENT_APPLICATION_CYA, new RespondentApplicationCYAController().get);
    app.get(PageUrls.NOTIFICATIONS, new TribunalOrdersAndRequestsController().get);
    app.get(PageUrls.NOTIFICATION_DETAILS, new TribunalOrderOrRequestDetailsController().get);
    app.get(PageUrls.ALL_JUDGMENTS, new AllJudgmentsController().get);
    app.get(PageUrls.JUDGMENT_DETAILS, new JudgmentDetailsController().get);
    app.get(PageUrls.ABOUT_HEARING_DOCUMENTS, new AboutHearingDocumentsController().get);
    app.post(PageUrls.ABOUT_HEARING_DOCUMENTS, new AboutHearingDocumentsController().post);
    app.get(PageUrls.TRIBUNAL_RESPOND_TO_ORDER, new TribunalRespondToOrderController().get);
    app.post(PageUrls.TRIBUNAL_RESPOND_TO_ORDER, new TribunalRespondToOrderController().post);
    app.get(PageUrls.TRIBUNAL_RESPONSE_CYA, new TribunalResponseCYAController().get);
    app.get(InterceptPaths.TRIBUNAL_RESPONSE_SUBMIT_CYA, new TribunalResponseSubmitController().get);
    app.get(PageUrls.TRIBUNAL_RESPONSE_COMPLETED, new TribunalResponseCompletedController().get);
    app.get(PageUrls.BUNDLES_COMPLETED, new BundlesCompletedController().get);
    app.get(PageUrls.BUNDLES_DOCS_FOR_HEARING_CYA, new BundlesDocsForHearingCYAController().get);
    app.get(PageUrls.ALL_DOCUMENTS, new AllDocumentsController().get);
    app.get(PageUrls.AGREEING_DOCUMENTS_FOR_HEARING, new AgreeingDocumentsForHearingController().get);
    app.post(PageUrls.AGREEING_DOCUMENTS_FOR_HEARING, new AgreeingDocumentsForHearingController().post);
    app.get(PageUrls.GENERAL_CORRESPONDENCE_LIST, new GeneralCorrespondenceListController().get);
    app.get(
      PageUrls.GENERAL_CORRESPONDENCE_NOTIFICATION_DETAILS,
      new GeneralCorrespondenceNotificationDetailsController().get
    );
    app.get(PageUrls.PREPARE_DOCUMENTS, new PrepareDocumentsController().get);
    app.get(PageUrls.RULE92_HOLDING_PAGE, new Rule92HoldingPageController().get);
    app.get(PageUrls.RESPOND_TO_TRIBUNAL_RESPONSE, new RespondToTribunalResponseController().get);
    app.post(PageUrls.RESPOND_TO_TRIBUNAL_RESPONSE, new RespondToTribunalResponseController().post);
    app.get(PageUrls.APPOINT_LEGAL_REPRESENTATIVE, new AppointLegalRepController().get);
    app.get(PageUrls.HEARING_DETAILS, new HearingDetailsController().get);
    app.get(PageUrls.CHANGE_LEGAL_REPRESENTATIVE, new ChangeLegalRepresentativeController().get);
    app.post(PageUrls.CHANGE_LEGAL_REPRESENTATIVE, new ChangeLegalRepresentativeController().post);
    app.get(PageUrls.YOUR_DETAILS_CYA, new YourDetailsCYAController().get);
  }
}

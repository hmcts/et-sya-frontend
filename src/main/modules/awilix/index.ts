import { InjectionMode, asClass, asValue, createContainer } from 'awilix';
import { Application } from 'express';

import AcasMultipleController from '../../controllers/AcasMultipleController';
import AcasSingleClaimController from '../../controllers/AcasSingleClaimController';
import AddressDetailsController from '../../controllers/AddressDetailsController';
import AddressLookupController from '../../controllers/AddressLookupController';
import AverageWeeklyHoursController from '../../controllers/AverageWeeklyHoursController';
import BenefitsController from '../../controllers/BenefitsController';
import CheckYourAnswersController from '../../controllers/CheckYourAnswersController';
import ChecklistController from '../../controllers/ChecklistController';
import ClaimSavedController from '../../controllers/ClaimSavedController';
import ClaimSubmittedController from '../../controllers/ClaimSubmittedController';
import ContactAcasController from '../../controllers/ContactAcasController';
import DesiredClaimOutcomeController from '../../controllers/DesiredClaimOutcomeController';
import DobController from '../../controllers/DobController';
import GenderDetailsController from '../../controllers/GenderDetailsController';
import HomeController from '../../controllers/HomeController';
import JobTitleController from '../../controllers/JobTitleController';
import LipOrRepController from '../../controllers/LipOrRepController';
import MultipleRespondentCheckController from '../../controllers/MultipleRespondentCheckController';
import NewAccountLandingController from '../../controllers/NewAccountLandingController';
import NewJobController from '../../controllers/NewJobController';
import NewJobPayController from '../../controllers/NewJobPayController';
import NewJobStartDateController from '../../controllers/NewJobStartDateController';
import NoticeEndController from '../../controllers/NoticeEndController';
import NoticePayController from '../../controllers/NoticePayController';
import NoticePeriodController from '../../controllers/NoticePeriodController';
import PastEmployerController from '../../controllers/PastEmployerController';
import PayAfterTaxController from '../../controllers/PayAfterTaxController';
import PayBeforeTaxController from '../../controllers/PayBeforeTaxController';
import PensionController from '../../controllers/PensionController';
import PlaceOfWorkController from '../../controllers/PlaceOfWorkController';
import PresentEmployerController from '../../controllers/PresentEmployerController';
import ReturnToExistingController from '../../controllers/ReturnToExistingController';
import SingleOrMultipleController from '../../controllers/SingleOrMultipleController';
import StartDateController from '../../controllers/StartDateController';
import StepsToMakingYourClaimController from '../../controllers/StepsToMakingYourClaimController';
import StillWorkingController from '../../controllers/StillWorkingController';
import SummariseYourClaimController from '../../controllers/SummariseYourClaimController';
import TelNumberController from '../../controllers/TelNumberController';
import TypeOfClaimController from '../../controllers/TypeOfClaimController';
import UpdatePreferenceController from '../../controllers/UpdatePreferenceController';
import ValidNoAcasReasonController from '../../controllers/ValidNoAcasReasonController';
import VideoHearingsController from '../../controllers/VideoHearingsController';

const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('app');

export class Container {
  public enableFor(app: Application): void {
    app.locals.container = createContainer({
      injectionMode: InjectionMode.CLASSIC,
    }).register({
      logger: asValue(logger),
      acasMultipleController: asClass(AcasMultipleController),
      acasSingleClaimController: asClass(AcasSingleClaimController),
      addressDetailsController: asClass(AddressDetailsController),
      addressLookupController: asClass(AddressLookupController),
      averageWeeklyHoursController: asClass(AverageWeeklyHoursController),
      benefitsController: asClass(BenefitsController),
      checkYourAnswersController: asClass(CheckYourAnswersController),
      checklistController: asClass(ChecklistController),
      claimSavedController: asClass(ClaimSavedController),
      claimSubmittedController: asClass(ClaimSubmittedController),
      contactAcasController: asClass(ContactAcasController),
      desiredClaimOutcomeController: asClass(DesiredClaimOutcomeController),
      dobController: asClass(DobController),
      genderDetailsController: asClass(GenderDetailsController),
      homeController: asClass(HomeController),
      jobTitleController: asClass(JobTitleController),
      lipOrRepController: asClass(LipOrRepController),
      multipleRespondentCheckController: asClass(MultipleRespondentCheckController),
      newAccountLandingController: asClass(NewAccountLandingController),
      newJobController: asClass(NewJobController),
      newJobPayController: asClass(NewJobPayController),
      newJobStartDateController: asClass(NewJobStartDateController),
      noticeEndController: asClass(NoticeEndController),
      noticePayController: asClass(NoticePayController),
      noticePeriodController: asClass(NoticePeriodController),
      pastEmployerController: asClass(PastEmployerController),
      payAfterTaxController: asClass(PayAfterTaxController),
      payBeforeTaxController: asClass(PayBeforeTaxController),
      pensionController: asClass(PensionController),
      placeOfWorkController: asClass(PlaceOfWorkController),
      presentEmployerController: asClass(PresentEmployerController),
      returnToExistingController: asClass(ReturnToExistingController),
      singleOrMultipleController: asClass(SingleOrMultipleController),
      startDateController: asClass(StartDateController),
      stepsToMakingYourClaimController: asClass(StepsToMakingYourClaimController),
      stillWorkingController: asClass(StillWorkingController),
      summariseYourClaimController: asClass(SummariseYourClaimController),
      telNumberController: asClass(TelNumberController),
      typeOfClaimController: asClass(TypeOfClaimController),
      updatePreferenceController: asClass(UpdatePreferenceController),
      validNoAcasReasonController: asClass(ValidNoAcasReasonController),
      videoHearingsController: asClass(VideoHearingsController),
    });
  }
}

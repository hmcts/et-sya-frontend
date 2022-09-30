import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { InterceptPaths, PageUrls, TranslationKeys } from '../definitions/constants';
import { TellUsWhatYouWant, TypesOfClaim } from '../definitions/definition';
import { AnyRecord } from '../definitions/util-types';

import { getEmploymentDetails } from './helpers/EmploymentAnswersHelper';
import { getRespondentSection } from './helpers/RespondentAnswersHelper';
import { getYourDetails } from './helpers/YourDetailsAnswersHelper';

export default class CheckYourAnswersController {
  public get(req: AppRequest, res: Response): void {
    const userCase = req.session?.userCase;
    const translations: AnyRecord = {
      ...req.t(TranslationKeys.CHECK_ANSWERS, { returnObjects: true }),
      ...req.t(TranslationKeys.ET1_DETAILS, { returnObjects: true }),
    };

    res.render(TranslationKeys.CHECK_ANSWERS, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...translations,
      PageUrls,
      userCase,
      InterceptPaths,
      typesOfClaim: userCase.typeOfClaim,
      showCompensationRequest: !!userCase.tellUsWhatYouWant?.includes(TellUsWhatYouWant.COMPENSATION_ONLY),
      showTribunalRequest: !!userCase.tellUsWhatYouWant?.includes(TellUsWhatYouWant.TRIBUNAL_RECOMMENDATION),
      showWhistleBlowingRequest: !!userCase.typeOfClaim?.includes(TypesOfClaim.WHISTLE_BLOWING),
      translations,
      yourDetails: getYourDetails(userCase, translations),
      employmentSection: getEmploymentDetails(userCase, translations),
      getRespondentSection,
      errors: req.session.errors,
    });
  }
}

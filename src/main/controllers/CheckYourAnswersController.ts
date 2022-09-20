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
    const translations: AnyRecord = { ...req.t(TranslationKeys.CHECK_ANSWERS, { returnObjects: true }) };
    const showCompensationRequest = !!userCase.tellUsWhatYouWant?.includes(TellUsWhatYouWant.COMPENSATION_ONLY);
    const showTribunalRequest = !!userCase.tellUsWhatYouWant?.includes(TellUsWhatYouWant.TRIBUNAL_RECOMMENDATION);
    const showWhistleBlowingRequest = !!userCase.typeOfClaim?.includes(TypesOfClaim.WHISTLE_BLOWING);
    const yourDetails = getYourDetails(userCase, translations);
    res.render(TranslationKeys.CHECK_ANSWERS, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CHECK_ANSWERS, { returnObjects: true }),
      PageUrls,
      userCase,
      respondents: req.session.userCase?.respondents,
      InterceptPaths,
      typesOfClaim: userCase.typeOfClaim,
      showCompensationRequest,
      showTribunalRequest,
      showWhistleBlowingRequest,
      translations,
      yourDetails,
      getRespondentSection,
      employmentSection: getEmploymentDetails(userCase, translations),
    });
  }
}

import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { CaseWithId } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { TellUsWhatYouWant } from '../definitions/definition';
export default class CheckYourAnswersController {
  public get(req: AppRequest, res: Response): void {
    const respondents = req.session.userCase?.respondents;
    const userCase = req.session?.userCase;
    const whatYouWantCompensation = getTellUsWhatYouWantCompensation(userCase);
    const whatYouWantTribunals = getTellUsWhatYouWantTribunals(userCase);
    res.render(TranslationKeys.CHECK_ANSWERS, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.ET1_FIELD_NAMES, { returnObjects: true }),
      ...req.t(TranslationKeys.CHECK_ANSWERS, { returnObjects: true }),
      PageUrls,
      userCase,
      respondents,
      whatYouWantCompensation,
      whatYouWantTribunals,
    });
  }
}
const getTellUsWhatYouWantCompensation = (userCase: CaseWithId) => {
  if (userCase?.tellUsWhatYouWant?.includes(TellUsWhatYouWant.COMPENSATION_ONLY) && userCase.compensationOutcome) {
    return userCase.compensationOutcome + ': ' + userCase.compensationAmount;
  } else {
    return '';
  }
};

const getTellUsWhatYouWantTribunals = (userCase: CaseWithId) => {
  if (userCase?.tellUsWhatYouWant?.includes(TellUsWhatYouWant.TRIBUNAL_RECOMMENDATION)) {
    return userCase.tribunalRecommendationRequest;
  } else {
    return '';
  }
};

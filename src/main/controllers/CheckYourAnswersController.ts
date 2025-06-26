import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { InterceptPaths, PageUrls, TranslationKeys } from '../definitions/constants';
import { AnyRecord } from '../definitions/util-types';

import { getClaimDetails } from './helpers/ClaimDetailsAnswersHelper';
import { getEmploymentDetails } from './helpers/EmploymentAnswersHelper';
import { getRespondentSection } from './helpers/RespondentAnswersHelper';
import { setNumbersToRespondents } from './helpers/RespondentHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';
import { getYourDetails } from './helpers/YourDetailsAnswersHelper';

export default class CheckYourAnswersController {
  public get(req: AppRequest, res: Response): void {
    if (!req.session || !req.session.userCase) {
      return res.redirect(PageUrls.CLAIMANT_APPLICATIONS);
    }
    const userCase = req.session?.userCase;
    if (userCase?.typeOfClaim === undefined || userCase?.typeOfClaim.length === 0) {
      if (req.session.errors === undefined) {
        req.session.errors = [];
      }
      req.session.errors.push({ propertyName: 'typeOfClaim', errorType: 'required' });
    }

    req.session.respondentRedirectCheckAnswer = undefined;

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.CHECK_ANSWERS, { returnObjects: true }),
      ...req.t(TranslationKeys.ET1_DETAILS, { returnObjects: true }),
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    };

    const newRespondentNum =
      req.session.userCase.respondents !== undefined ? req.session.userCase.respondents.length + 1 : undefined;

    setNumbersToRespondents(userCase.respondents);

    res.render(TranslationKeys.CHECK_ANSWERS, {
      ...translations,
      PageUrls,
      userCase,
      respondents: req.session.userCase?.respondents,
      InterceptPaths,
      typesOfClaim: userCase.typeOfClaim,
      translations,
      yourDetails: getYourDetails(userCase, translations),
      employmentSection: getEmploymentDetails(userCase, translations),
      getRespondentSection,
      claimDetailsSection: getClaimDetails(userCase, translations),
      errors: req.session.errors,
      languageParam: getLanguageParam(req.url),
      isAddRespondent: newRespondentNum <= 5,
    });
  }
}

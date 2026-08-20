import { Response } from 'express';

import {
  validateClaimCheckDetails,
  validateEmploymentAndRespondentDetails,
  validatePersonalDetails,
} from '../components/form/claim-details-validator';
import { validateGroupClaimsCheckDetails } from '../components/form/group-claims-validator';
import { returnValidUrl } from '../controllers/helpers/RouterHelpers';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls } from '../definitions/constants';

import { createCheckDecorator } from './BaseDecorator';

/**
 * A decorator function that wraps a method to validate that every section of the claim is complete before
 * the Check Your Answers page is shown.
 *
 * If no type of claim has been selected, the user is redirected to the "steps to making your claim" page.
 * Otherwise, each section is validated; any section that fails validation has its respective check field set
 * to `YesOrNo.NO`. If any of the section check fields are `YesOrNo.NO`, the user is redirected to the
 * "steps to making your claim" page and the original method is not executed.
 *
 *  A decorator function that can be applied to methods or properties.
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function CheckAnswersValidationCheck() {
  return createCheckDecorator(checkAnswersValidationAndRedirect);
}

export const checkAnswersValidationAndRedirect = (req: AppRequest, res: Response): boolean => {
  const userCase = req.session?.userCase;

  if (!userCase) {
    res.redirect(returnValidUrl(PageUrls.CLAIMANT_APPLICATIONS));
    return true;
  }

  if (!validatePersonalDetails(userCase)) {
    userCase.personalDetailsCheck = YesOrNo.NO;
  }

  if (!validateGroupClaimsCheckDetails(req, userCase)) {
    userCase.groupClaimsCheck = YesOrNo.NO;
  }

  if (!Array.isArray(userCase.respondents) || !validateEmploymentAndRespondentDetails(userCase)) {
    userCase.employmentAndRespondentCheck = YesOrNo.NO;
  }

  if (
    !validateClaimCheckDetails(userCase) ||
    userCase?.typeOfClaim === undefined ||
    userCase.typeOfClaim.length === 0
  ) {
    userCase.claimDetailsCheck = YesOrNo.NO;
  }

  if (
    userCase.personalDetailsCheck === YesOrNo.NO ||
    userCase.groupClaimsCheck === YesOrNo.NO ||
    userCase.employmentAndRespondentCheck === YesOrNo.NO ||
    userCase.claimDetailsCheck === YesOrNo.NO
  ) {
    req.session.additionalClaimantsRedirectCheckAnswer = undefined;
    req.session.returnUrl = undefined;
    res.redirect(returnValidUrl(PageUrls.CLAIM_STEPS));
    return true;
  }

  return false;
};

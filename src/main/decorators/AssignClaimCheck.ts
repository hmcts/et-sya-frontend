import { Response } from 'express';

import { getLanguageParam } from '../controllers/helpers/RouterHelpers';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';

import { createCheckDecorator } from './BaseDecorator';

/**
 * A decorator function that wraps a method to check a variable for claim assignment and redirect if necessary.
 * If the `checkAssignClaimAndRedirect` function determines a redirect is needed, the original method will not be executed.
 * Otherwise, the original method is invoked with the provided arguments.
 *
 *  A decorator function that can be applied to methods or properties.
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function AssignClaimCheck() {
  return createCheckDecorator(checkAssignClaimAndRedirect);
}
export const checkAssignClaimAndRedirect = (req: AppRequest, res: Response): boolean => {
  const { url, session } = req;

  if (!session?.visitedAssignClaimFlow) {
    const redirectUrl = session?.user
      ? `${PageUrls.CLAIMANT_APPLICATIONS}${getLanguageParam(url)}`
      : `${PageUrls.RETURN_TO_EXISTING}${getLanguageParam(url)}`;
    res.redirect(redirectUrl);
    return true;
  }

  if (url.includes(PageUrls.YOUR_DETAILS_FORM) && !session?.caseNumberChecked) {
    res.redirect(`${PageUrls.CASE_NUMBER_CHECK}${getLanguageParam(url)}`);
    return true;
  }

  if (url.includes(PageUrls.YOUR_DETAILS_CYA) && !session?.yourDetailsVerified) {
    res.redirect(`${PageUrls.YOUR_DETAILS_FORM}${getLanguageParam(url)}`);
    return true;
  }

  return false;
};

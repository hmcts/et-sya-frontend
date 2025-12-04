import { Response } from 'express';

import { getLanguageParam, returnValidUrl } from '../controllers/helpers/RouterHelpers';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';
import { CaseState } from '../definitions/definition';
import NumberUtils from '../utils/NumberUtils';

import { createCheckDecorator } from './BaseDecorator';

/**
 * A decorator function that wraps a method to check the case state and redirect if necessary.
 * If the `checkCaseStateAndRedirect` function determines a redirect is needed, the original method will not be executed.
 * Otherwise, the original method is invoked with the provided arguments.
 *
 *  A decorator function that can be applied to methods or properties.
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function CaseStateCheck() {
  return createCheckDecorator(checkCaseStateAndRedirect);
}

export const checkCaseStateAndRedirect = (req: AppRequest, res: Response): boolean => {
  const userCase = req.session?.userCase;
  let redirectUrl: string | null = null;

  if (userCase?.state !== CaseState.AWAITING_SUBMISSION_TO_HMCTS) {
    if (NumberUtils.isNumericValue(userCase?.id)) {
      redirectUrl = `/citizen-hub/${userCase.id}${getLanguageParam(req.url)}`;
    } else {
      redirectUrl = PageUrls.CLAIMANT_APPLICATIONS;
    }
  }
  if (redirectUrl) {
    res.redirect(returnValidUrl(redirectUrl));
    return true;
  }
  return false;
};

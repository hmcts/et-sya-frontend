import { Response } from 'express';

import { getLanguageParam } from '../controllers/helpers/RouterHelpers';
import { AppRequest } from '../definitions/appRequest';

import { createCheckDecorator } from './BaseDecorator';

/**
 * A decorator function that wraps a method to check the user has selected delete claim and redirect if necessary.
 * If the `checkStateAndRedirect` function determines a redirect is needed, the original method will not be executed.
 * Otherwise, the original method is invoked with the provided arguments.
 *
 *  A decorator function that can be applied to methods or properties.
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function DeleteClaimCheck() {
  return createCheckDecorator(checkStateAndRedirect);
}

export const checkStateAndRedirect = (req: AppRequest, res: Response): boolean => {
  const currentUrl = req.url;

  if (currentUrl.includes('/delete') && currentUrl.includes('/claimant-application/')) {
    const caseId = req.params.id;

    // 1. Check if the case exists in the user's active cases
    const caseExists = req.session?.userCases?.some(userCase => String(userCase.id) === String(caseId));

    // 2. Check if the case has already been deleted
    const isAlreadyDeleted = req.session?.deletedCaseIds?.includes(caseId);

    // If the case doesn't exist OR it has already been deleted, kick them back
    if (!caseExists || isAlreadyDeleted) {
      const redirectUrl = `/claimant-applications${getLanguageParam(currentUrl)}`;
      res.redirect(redirectUrl);
      return true;
    }
  }

  return false;
};

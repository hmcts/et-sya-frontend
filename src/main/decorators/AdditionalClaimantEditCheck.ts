import { Response } from 'express';

import { getLanguageParam, returnValidUrl } from '../controllers/helpers/RouterHelpers';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';

import { createCheckDecorator } from './BaseDecorator';

/**
 * A decorator function that wraps a method to check if a valid additionalClaimant index
 * is provided in the query string and exists in the session.
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function AdditionalClaimantCheck() {
  return createCheckDecorator(checkAdditionalClaimantAndRedirect);
}

export const checkAdditionalClaimantAndRedirect = (req: AppRequest, res: Response): boolean => {
  const claimants = req.session?.userCase?.additionalClaimants;
  const claimantQuery = req.query?.additionalClaimant;
  let redirectUrl: string | null = null;

  // If it's present, try to parse it as a number and validate against the session array
  // (Handles strings like "0", native numbers like 0, or even arrays like ["0"])
  const normalizedQuery = Array.isArray(claimantQuery) ? claimantQuery[0] : claimantQuery;
  const claimantIndex = Number.parseInt(String(normalizedQuery), 10);

  if (
    Number.isNaN(claimantIndex) ||
    claimantIndex < 0 ||
    !Array.isArray(claimants) ||
    claimants[claimantIndex] === undefined ||
    claimants?.length === 5
  ) {
    redirectUrl = PageUrls.REVIEW_ADDITIONAL_CLAIMANTS;
  }

  // Early exit redirect if a validation rule tripped
  if (redirectUrl) {
    res.redirect(returnValidUrl(redirectUrl + getLanguageParam(req.url)));
    return true;
  }

  return false; // Safely proceed to your controller GET handler
};

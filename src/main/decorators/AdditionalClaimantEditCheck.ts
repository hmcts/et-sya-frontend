import { Response } from 'express';

import { getLanguageParam, returnValidUrl } from '../controllers/helpers/RouterHelpers';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';
import { getLogger } from '../logger';

import { createCheckDecorator } from './BaseDecorator';

const logger = getLogger('AdditionalClaimantCheck');

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

  // 1. If it's missing entirely, it's a creation flow -> skip validation completely
  if (claimantQuery === undefined || claimantQuery === null || claimantQuery === '') {
    return false;
  }

  let redirectUrl: string | null = null;

  // 2. Coerce whatever is inside the query directly into a native base-10 number
  // (Handles strings like "0", native numbers like 0, or even arrays like ["0"])
  const normalizedQuery = Array.isArray(claimantQuery) ? claimantQuery[0] : claimantQuery;
  const claimantIndex = Number.parseInt(String(normalizedQuery), 10);

  // 3. Validate if the parsing produced a valid positive/zero index integer
  if (Number.isNaN(claimantIndex) || claimantIndex < 0) {
    logger.info(`AdditionalClaimantCheck failed: Malformed or negative query index [${claimantQuery}].`);
    redirectUrl = PageUrls.REVIEW_ADDITIONAL_CLAIMANTS;
  }
  // 4. Ensure the claimants array exists and a record is sitting at that position
  else if (!claimants || !Array.isArray(claimants) || claimants[claimantIndex] === undefined) {
    logger.info(`AdditionalClaimantCheck failed: No claimant found at index [${claimantIndex}].`);
    redirectUrl = PageUrls.REVIEW_ADDITIONAL_CLAIMANTS;
  }

  // 5. Early exit redirect if a validation rule tripped
  if (redirectUrl) {
    res.redirect(returnValidUrl(redirectUrl + getLanguageParam(req.url)));
    return true;
  }

  return false; // Safely proceed to your controller GET handler
};

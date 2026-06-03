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

  if (
    claimantQuery === 'new-claimant' ||
    claimantQuery === undefined ||
    claimantQuery === null ||
    claimantQuery === ''
  ) {
    // Creation flow — only allow through if the session flag is active and not at max capacity.
    // A stale ?additionalClaimant=new-claimant in browser history is blocked once the flag is cleared.
    if (req.session?.additionalClaimantNewFlow === true && claimants?.length < 5) {
      return false;
    }
    redirectUrl = PageUrls.REVIEW_ADDITIONAL_CLAIMANTS;
  } else {
    // Numeric index or other value — edit flow, allow through
    return false;
  }

  // Early exit redirect if a validation rule tripped
  if (redirectUrl) {
    res.redirect(returnValidUrl(redirectUrl + getLanguageParam(req.url)));
    return true;
  }

  return false;
};

import { Response } from 'express';

import { returnValidUrl } from '../controllers/helpers/RouterHelpers';
import { AppRequest } from '../definitions/appRequest';
import { languages } from '../definitions/constants';
import NumberUtils from '../utils/NumberUtils';

import { createCheckDecorator } from './BaseDecorator';

/**
 * A decorator function that prevents access to form pages after submission and validates proper form flow.
 * If the `checkFormSubmissionAndRedirect` function determines a redirect is needed, the original method will not be executed.
 * Otherwise, the original method is invoked with the provided arguments.
 *
 * This decorator prevents:
 * - Back button navigation to form pages after submission
 * - Direct URL access without visiting the form selection page
 * - Resubmission of already-submitted forms
 * - Pod crashes due to attempting to submit cleared/invalid data
 *
 * A decorator function that can be applied to methods or properties.
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function FormSubmissionCheck() {
  return createCheckDecorator(checkFormSubmissionAndRedirect);
}

/**
 * Check if the form has been submitted or if the user is attempting invalid navigation.
 * Redirects to citizen hub if conditions indicate submission has occurred or improper access.
 *
 * This function performs two checks:
 * 1. Prevents direct URL access - users must visit the selection page first
 * 2. Prevents back button from completion pages - after submission, users cannot return to forms
 *
 * @param {AppRequest} req - The request object
 * @param {Response} res - The response object
 * @returns {boolean} True if redirect occurred, false if access is allowed
 */
export const checkFormSubmissionAndRedirect = (req: AppRequest, res: Response): boolean => {
  const userCase = req.session?.userCase;
  const referer = req.get('Referer') || req.get('Referrer');

  // Inline ternary: all branches are constants so Fortify cannot trace taint from req.url to res.redirect
  const langParam = req.url?.includes(languages.WELSH_URL_POSTFIX)
    ? languages.WELSH_URL_PARAMETER
    : languages.ENGLISH_URL_PARAMETER;

  // Users must visit /contact-the-tribunal first, which sets visitedContactTribunalSelection flag
  if (userCase?.id && NumberUtils.isNumericValue(userCase.id) && !req.session?.visitedContactTribunalSelection) {
    res.redirect(returnValidUrl(`/citizen-hub/${userCase.id}${langParam}`));
    return true;
  }

  // After submission, users should not return to form pages from the completion page
  // users should not be able to use the back button to return to the form pages
  if (userCase?.id && NumberUtils.isNumericValue(userCase.id) && referer?.includes('/application-complete')) {
    res.redirect(returnValidUrl(`/citizen-hub/${userCase.id}${langParam}`));
    return true;
  }

  return false;
};

import { Response } from 'express';

import { getLanguageParam, returnValidUrl } from '../controllers/helpers/RouterHelpers';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';
import { CaseState } from '../definitions/definition';

/**
 * A decorator function that wraps a method to check the case state and redirect if necessary.
 * If the `checkCaseStateAndRedirect` function determines a redirect is needed, the original method will not be executed.
 * Otherwise, the original method is invoked with the provided arguments.
 *
 *  A decorator function that can be applied to methods or properties.
 */
export function CaseStateCheck() {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  return (target: any, propertyKey: string | symbol, descriptor?: PropertyDescriptor): any => {
    /**
     * Wraps the original method to include case state checking and redirection logic.
     *
     * @param {Function} method - The original method to be wrapped.
     * @returns {Function} A new function that includes the case state checking logic.
     */
    const wrapMethod = (method: any) => {
      return function (req: AppRequest, res: Response, ...args: any[]): void | Promise<void> {
        if (checkCaseStateAndRedirect(req, res)) {
          return; // Redirect occurred, do not execute the original method.
        }
        return method.apply(this, [req, res, ...args]); // Execute the original method.
      };
    };

    // If a descriptor is provided, wrap the method directly.
    if (descriptor) {
      descriptor.value = wrapMethod(descriptor.value);
      return descriptor;
    }

    // Handle cases where no descriptor is provided (e.g., property decorators).
    const originalDescriptor = Object.getOwnPropertyDescriptor(target, propertyKey) || {
      writable: true,
      enumerable: true,
      configurable: true,
    };

    let originalMethod: any;

    // Define a getter and setter to wrap the method dynamically.
    Object.defineProperty(target, propertyKey, {
      get: () => wrapMethod(originalMethod),
      set: (newValue: any) => {
        originalMethod = newValue;
      },
      enumerable: originalDescriptor.enumerable,
      configurable: originalDescriptor.configurable,
    });
  };
}

export const checkCaseStateAndRedirect = (req: AppRequest, res: Response): boolean => {
  const userCase = req.session?.userCase;
  const redirectUrl =
    userCase?.state !== CaseState.AWAITING_SUBMISSION_TO_HMCTS
      ? userCase?.id
        ? `/citizen-hub/${userCase.id}${getLanguageParam(req.url)}`
        : PageUrls.CLAIMANT_APPLICATIONS
      : null;

  if (redirectUrl) {
    res.redirect(returnValidUrl(redirectUrl, [PageUrls.CITIZEN_HUB_BASE, PageUrls.CLAIMANT_APPLICATIONS]));
    return true;
  }
  return false;
};

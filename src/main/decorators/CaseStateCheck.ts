import { Response } from 'express';

import { getLanguageParam } from '../controllers/helpers/RouterHelpers';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';
import { CaseState } from '../definitions/definition';

export function CaseStateCheck() {
  return (_target: never, _propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
    const originalMethod = descriptor.value;

    descriptor.value = function (req: AppRequest, res: Response, ...args: any[]): void | Promise<void> {
      if (checkCaseStateAndRedirect(req, res)) {
        return;
      }
      return originalMethod.apply(this, [req, res, ...args]);
    };

    return descriptor;
  };
}

export const checkCaseStateAndRedirect = (req: AppRequest, res: Response): boolean => {
  const redirectUrl =
    req.session.userCase?.state !== CaseState.AWAITING_SUBMISSION_TO_HMCTS
      ? req.session.userCase?.id
        ? `/citizen-hub/${req.session.userCase.id}${getLanguageParam(req.url)}`
        : PageUrls.CLAIMANT_APPLICATIONS
      : null;
  if (redirectUrl) {
    res.redirect(redirectUrl);
    return true;
  }
  return false;
};

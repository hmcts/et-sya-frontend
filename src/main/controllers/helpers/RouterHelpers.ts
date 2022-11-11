import { Response } from 'express';

import { AppRequest } from '../../definitions/appRequest';
import { PageUrls } from '../../definitions/constants';
import { FormFields } from '../../definitions/form';

export const handleSaveAsDraft = (res: Response): void => {
  return res.redirect(PageUrls.CLAIM_SAVED);
};

export const conditionalRedirect = (
  req: AppRequest,
  formFields: FormFields,
  condition: boolean | string | string[]
): boolean => {
  const matchingValues = Object.entries(req.body).find(([k]) => Object.keys(formFields).some(ff => ff === k));
  if (Array.isArray(condition) && matchingValues) {
    return matchingValues.some(v => {
      return condition.some(c => (Array.isArray(v) ? v.some(e => String(e) === c) : v.includes(c)));
    });
  }
  return matchingValues?.some(v => v === condition);
};

export const returnNextPage = (req: AppRequest, res: Response, redirectUrl: string): void => {
  const nextPage = handleReturnUrl(req, redirectUrl);
  return res.redirect(nextPage);

  //else {
  //   return res.redirect(ErrorPages.NOT_FOUND);
  // }
};

const handleReturnUrl = (req: AppRequest, redirectUrl: string): string => {
  let nextPage = redirectUrl;
  if (req.session.returnUrl) {
    nextPage = req.session.returnUrl;
    req.session.returnUrl = undefined;
  }
  return nextPage;
};

// const validateUrl = (url: string): boolean => {
//   const ValidUrls = Object.values(PageUrls);
//   if (ValidUrls.includes(url)) return true;
//   return false;
// };

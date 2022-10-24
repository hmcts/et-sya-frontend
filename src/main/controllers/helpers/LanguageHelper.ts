import { AppRequest } from '../../definitions/appRequest';

export const setUrlLanguage = (req: AppRequest, redirectUrl: string): string => {
  const english = '?lng=en';
  const welsh = '?lng=cy';
  if ((req.url as string)?.includes(english)) {
    redirectUrl += english;
  }
  if ((req.url as string)?.includes(welsh)) {
    redirectUrl += welsh;
  }
  return redirectUrl;
};

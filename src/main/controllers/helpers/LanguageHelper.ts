import { AppRequest } from '../../definitions/appRequest';

export const setUrlLanguage = (req: AppRequest, redirectUrl: string): string => {
  const english = '?lng=en';
  const welsh = '?lng=cy';
  return (req.url as string)?.includes(welsh) ? redirectUrl + welsh : redirectUrl + english;
};

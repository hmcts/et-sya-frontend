import { LegacyUrls } from '../definitions/constants';

export default function getLegacyUrlFromLng(path: string, lng = 'en'): URL['href'] {
  const legacyUrl = new URL(LegacyUrls.ET1_BASE);
  legacyUrl.pathname = lng + path;
  return legacyUrl.href;
}

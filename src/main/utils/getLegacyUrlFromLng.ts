import { LEGACY_URLS } from '../definitions/constants';

export default function getLegacyUrlFromLng(lng = 'en'):URL['href'] {
  const legacyUrl = new URL(LEGACY_URLS.ET1_BASE);
  legacyUrl.pathname = lng + LEGACY_URLS.ET1_PATH;
  return legacyUrl.href;
}
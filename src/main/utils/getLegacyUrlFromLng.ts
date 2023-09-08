import config from 'config';
/* eslint-disable */
export default function getLegacyUrlFromLng(path: string, lng = 'en'): URL['href'] {
  const url: string = config.get('services.et1Legacy.url');
  const legacyUrl = new URL(`${url}`);
  // Temporarily disabling the language and path so it hit's the shutter page
  // legacyUrl.pathname = lng + path;
  return legacyUrl.href;
}

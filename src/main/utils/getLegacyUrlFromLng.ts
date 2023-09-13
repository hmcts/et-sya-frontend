/* eslint-disable */
export default function getLegacyUrlFromLng(path: string, lng = 'en'): URL['href'] {
  const url: string = process.env.ET1_BASE_URL ?? 'https://et-stg-azure.staging.et.dsd.io';
  const legacyUrl = new URL(`${url}`);
  // Temporarily disabling the language and path so it hit's the shutter page
  // legacyUrl.pathname = lng + path;
  return legacyUrl.href;
}

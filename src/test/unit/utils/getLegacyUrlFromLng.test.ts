import { LegacyUrls } from '../../../main/definitions/constants';
import getLegacyUrl from '../../../main/utils/getLegacyUrlFromLng';

const expectedEnUrl = LegacyUrls.ET1;
const expectedCyUrl = LegacyUrls.ET1.replace('/en/', '/cy/');
const en = 'en';
const cy = 'cy';

describe('Get Legacy Url with correct language', () => {
  it.skip('should return en url when language is English', () => {
    const path = `${LegacyUrls.ET1_APPLY}${LegacyUrls.ET1_PATH}`;
    const url = getLegacyUrl(path, en);
    expect(url).toBe(expectedEnUrl);
  });
  it.skip('should return cy url when language is Welsh', () => {
    const path = `${LegacyUrls.ET1_APPLY}${LegacyUrls.ET1_PATH}`;
    const url = getLegacyUrl(path, cy);
    expect(url).toBe(expectedCyUrl);
  });
  it.skip('should return en url when language is undefined', () => {
    const path = `${LegacyUrls.ET1_APPLY}${LegacyUrls.ET1_PATH}`;
    const url = getLegacyUrl(path, undefined);
    expect(url).toBe(expectedEnUrl);
  });
});

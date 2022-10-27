import { LegacyUrls, languages } from '../../../main/definitions/constants';
import getLegacyUrl from '../../../main/utils/getLegacyUrlFromLng';

const expectedEnUrl = LegacyUrls.ET1;
const expectedCyUrl = 'https://employmenttribunals.service.gov.uk/cy/apply/application-number';
const en = languages.ENGLISH;
const cy = languages.WELSH;

describe('Get Legacy Url with correct language', () => {
  it('should return en url when language is English', () => {
    const path = `${LegacyUrls.ET1_APPLY}${LegacyUrls.ET1_PATH}`;
    const url = getLegacyUrl(path, en);
    expect(url).toBe(expectedEnUrl);
  });
  it('should return cy url when language is Welsh', () => {
    const path = `${LegacyUrls.ET1_APPLY}${LegacyUrls.ET1_PATH}`;
    const url = getLegacyUrl(path, cy);
    expect(url).toBe(expectedCyUrl);
  });
  it('should return en url when language is undefined', () => {
    const path = `${LegacyUrls.ET1_APPLY}${LegacyUrls.ET1_PATH}`;
    const url = getLegacyUrl(path, undefined);
    expect(url).toBe(expectedEnUrl);
  });
});

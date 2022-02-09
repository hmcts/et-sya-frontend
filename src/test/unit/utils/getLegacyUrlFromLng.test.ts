import { LEGACY_URLS } from '../../../main/definitions/constants';
import getLegacyUrl from '../../../main/utils/getLegacyUrlFromLng';

const expectedEnUrl = LEGACY_URLS.ET1;
const expectedCyUrl = 'https://employmenttribunals.service.gov.uk/cy/apply/application-number';
const en = 'en';
const cy = 'cy';

describe('Get Legacy Url with correct language', () => {
  it('should return en url when language is English', () => {
    const url = getLegacyUrl(en);
    expect(url).toBe(expectedEnUrl);
  });
  it('should return cy url when language is Welsh', () => {
    const url = getLegacyUrl(cy);
    expect(url).toBe(expectedCyUrl);
  });
  it('should return en url when language is undefined', () => {
    const url = getLegacyUrl(undefined);
    expect(url).toBe(expectedEnUrl);
  });
});

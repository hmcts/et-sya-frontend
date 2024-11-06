import request from 'supertest';

import { app } from '../../main/app';
import { returnValidUrl } from '../../main/controllers/helpers/RouterHelpers';
import { AuthUrls, LegacyUrls, PageUrls } from '../../main/definitions/constants';
import { noSignInRequiredEndpoints } from '../../main/modules/oidc/noSignInRequiredEndpoints';

const authenticatedRoutes = Object.values(PageUrls).filter(
  url => !noSignInRequiredEndpoints.includes(url) && url !== LegacyUrls.ET1 && url !== LegacyUrls.ET1_BASE
);

describe('GET unauthenticated routes', () => {
  it.each(noSignInRequiredEndpoints)('should redirect to %p', async (url: string) => {
    const res = await request(app).get(url);
    expect(res.status).toStrictEqual(200);
  });
});

describe('GET authenticated routes', () => {
  it.each(authenticatedRoutes)('request for %p should redirect to login', async (url: string) => {
    const res = await request(app).get(returnValidUrl(url, Object.values(authenticatedRoutes)));
    expect(res.status).toStrictEqual(302);
    expect(res.header['location']).toStrictEqual(AuthUrls.LOGIN);
  });
});

import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.CONTACT_PREFERENCE}`, () => {
  it('should return the how would you like to be contacted about your claim page', async () => {
    const res = await request(mockApp({})).get(PageUrls.CONTACT_PREFERENCE);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.CONTACT_PREFERENCE}`, () => {
  test('should go to the hearing preference page when the Email radio button is selected', async () => {
    await request(mockApp({}))
      .post(PageUrls.CONTACT_PREFERENCE)
      .send({ claimant_contact_preference: 'Email' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.HEARING_PREFERENCE);
      });
  });

  test('should go to the hearing preference page when the Post radio button is selected', async () => {
    await request(mockApp({}))
      .post(PageUrls.CONTACT_PREFERENCE)
      .send({ claimant_contact_preference: 'Post' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.HEARING_PREFERENCE);
      });
  });

  test('should reload the page when the no radio button is selected', async () => {
    await request(mockApp({}))
      .post(PageUrls.CONTACT_PREFERENCE)
      .send({ claimant_contact_preference: undefined })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.CONTACT_PREFERENCE);
      });
  });
});

import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.ADD_ANOTHER_CLAIMANT}`, () => {
  it('should return the add another claimant page', async () => {
    const res = await request(mockApp({})).get(PageUrls.ADD_ANOTHER_CLAIMANT);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.ADD_ANOTHER_CLAIMANT}`, () => {
  test('should redirect to personal details when manual is selected', async () => {
    await request(mockApp({}))
      .post(PageUrls.ADD_ANOTHER_CLAIMANT)
      .send({ addClaimantMethod: 'manual' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.OTHER_CLAIMANT_PERSONAL_DETAILS);
      });
  });

  test('should redirect to spreadsheet page when spreadsheet is selected', async () => {
    await request(mockApp({}))
      .post(PageUrls.ADD_ANOTHER_CLAIMANT)
      .send({ addClaimantMethod: 'spreadsheet' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.ADD_CLAIMANTS_SPREADSHEET);
      });
  });

  test('should return the add another claimant page when no option is selected', async () => {
    await request(mockApp({}))
      .post(PageUrls.ADD_ANOTHER_CLAIMANT)
      .send({ addClaimantMethod: undefined })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.ADD_ANOTHER_CLAIMANT);
      });
  });
});

import request from 'supertest';

import * as helper from '../../main/controllers/helpers/CaseHelpers';
import { YesOrNo } from '../../main/definitions/case';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.GROUP_REPRESENTATIVE}`, () => {
  it('should return the group representative page', async () => {
    const res = await request(mockApp({})).get(PageUrls.GROUP_REPRESENTATIVE);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.GROUP_REPRESENTATIVE}`, () => {
  jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

  test('should redirect to claim steps when yes is selected', async () => {
    await request(mockApp({}))
      .post(PageUrls.GROUP_REPRESENTATIVE)
      .send({ leadClaimant: YesOrNo.YES })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.GROUP_CLAIMS_CHECK);
      });
  });

  test('should redirect to claim steps when no is selected', async () => {
    await request(mockApp({}))
      .post(PageUrls.GROUP_REPRESENTATIVE)
      .send({ leadClaimant: YesOrNo.NO })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.GROUP_CLAIMS_CHECK);
      });
  });

  test('should return the group representative page when no option is selected', async () => {
    await request(mockApp({}))
      .post(PageUrls.GROUP_REPRESENTATIVE)
      .send({ leadClaimant: undefined })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.GROUP_REPRESENTATIVE);
      });
  });
});

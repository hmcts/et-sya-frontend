import request from 'supertest';

import * as helper from '../../main/controllers/helpers/CaseHelpers';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.CLAIM_TYPE_PAY}`, () => {
  it('should return the claim type pay page', async () => {
    const res = await request(mockApp({})).get(PageUrls.CLAIM_TYPE_PAY);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.CLAIM_TYPE_PAY}`, () => {
  test('should navigate to the tell us what you want page when save and continue button is clicked', async () => {
    jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementationOnce(() => Promise.resolve());
    await request(mockApp({}))
      .post(PageUrls.CLAIM_TYPE_PAY)
      .send({ claimTypePay: ['holidayPay'] })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.DESCRIBE_WHAT_HAPPENED);
      });
  });
});

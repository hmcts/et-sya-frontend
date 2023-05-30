import * as helper from '../../main/controllers/helpers/CaseHelpers';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

import request from 'supertest';

describe(`GET ${PageUrls.END_DATE}`, () => {
  it('should return the end date page', async () => {
    const res = await request(mockApp({})).get(PageUrls.END_DATE);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.END_DATE}`, () => {
  jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementationOnce(() => Promise.resolve());
  test('should navigate to the notice period page when save and continue button is clicked', async () => {
    await request(mockApp({}))
      .post(PageUrls.END_DATE)
      .send({ 'endDate-day': '10', 'endDate-month': '10', 'endDate-year': '2020' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.NOTICE_PERIOD);
      });
  });
});

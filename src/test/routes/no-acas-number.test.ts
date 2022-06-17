import request from 'supertest';

import { NoAcasNumberReason } from '../../main/definitions/case';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.NO_ACAS_NUMBER}`, () => {
  it('should return the reason for no acas number page', async () => {
    const res = await request(mockApp({})).get(PageUrls.NO_ACAS_NUMBER);
    expect(res.type).toEqual('text/html');
    expect(res.status).toEqual(200);
  });
});

describe(`on POST ${PageUrls.NO_ACAS_NUMBER}`, () => {
  test('should load respondent details check page when an answer is selected', async () => {
    await request(mockApp({}))
      .post(PageUrls.NO_ACAS_NUMBER)
      .send({ noAcasReason: NoAcasNumberReason.ANOTHER })
      .expect(res => {
        expect(res.status).toEqual(302);
        expect(res.header['location']).toEqual(PageUrls.RESPONDENT_DETAILS_CHECK);
      });
  });
});

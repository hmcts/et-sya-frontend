import request from 'supertest';

import { YesOrNo } from '../../main/definitions/case';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.COPY_TO_OTHER_PARTY}`, () => {
  it('should return the Rule 92 page', async () => {
    const res = await request(mockApp({})).get(PageUrls.COPY_TO_OTHER_PARTY);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.COPY_TO_OTHER_PARTY}`, () => {
  test('should navigate to the contact the tribunal cya page when save and continue button is clicked', async () => {
    await request(mockApp({}))
      .post(PageUrls.COPY_TO_OTHER_PARTY)
      .send({ copyToOtherPartyYesOrNo: YesOrNo.YES })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.CONTACT_THE_TRIBUNAL_CYA);
      });
  });
});

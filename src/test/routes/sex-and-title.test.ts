import request from 'supertest';

import * as helper from '../../main/controllers/helpers/CaseHelpers';
import { Sex } from '../../main/definitions/case';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.SEX_AND_TITLE}`, () => {
  it('should return the gender details page', async () => {
    const res = await request(mockApp({})).get(PageUrls.SEX_AND_TITLE);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`POST ${PageUrls.SEX_AND_TITLE}`, () => {
  jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());
  test('should go to the address details page', async () => {
    await request(mockApp({}))
      .post(PageUrls.SEX_AND_TITLE)
      .send({ claimantSex: Sex.MALE, preferredTitle: 'Mr' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.POSTCODE_ENTER);
      });
  });
  test('should return gender details page if title contains number', async () => {
    const body = {
      claimantSex: Sex.MALE,
      preferredTitle: '7',
    };
    await request(mockApp({ body }))
      .post(PageUrls.SEX_AND_TITLE)
      .expect(res => {
        expect(res.header['location']).toStrictEqual(PageUrls.SEX_AND_TITLE);
      });
  });
});

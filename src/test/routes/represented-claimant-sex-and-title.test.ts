import request from 'supertest';

import * as helper from '../../main/controllers/helpers/CaseHelpers';
import { Sex } from '../../main/definitions/case';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.REPRESENTED_CLAIMANT_SEX_AND_TITLE}`, () => {
  it('should return the represented claimant sex and title page', async () => {
    const res = await request(mockApp({})).get(PageUrls.REPRESENTED_CLAIMANT_SEX_AND_TITLE);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`POST ${PageUrls.REPRESENTED_CLAIMANT_SEX_AND_TITLE}`, () => {
  jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

  test('should redirect to represented claimant enter postcode', async () => {
    await request(mockApp({}))
      .post(PageUrls.REPRESENTED_CLAIMANT_SEX_AND_TITLE)
      .send({ claimantSex: Sex.MALE, preferredTitle: 'Mr' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.REPRESENTED_CLAIMANT_ENTER_POSTCODE);
      });
  });

  test('should return to sex and title page if title contains number', async () => {
    const body = {
      claimantSex: Sex.MALE,
      preferredTitle: '7',
    };
    await request(mockApp({ body }))
      .post(PageUrls.REPRESENTED_CLAIMANT_SEX_AND_TITLE)
      .expect(res => {
        expect(res.header['location']).toStrictEqual(PageUrls.REPRESENTED_CLAIMANT_SEX_AND_TITLE);
      });
  });
});

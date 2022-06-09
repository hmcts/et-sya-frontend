import request from 'supertest';

import { YesOrNo } from '../../main/definitions/case';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.WORK_ADDRESS}`, () => {
  it('should return the did you work at respondent address page', async () => {
    const res = await request(
      mockApp({
        userCase: {
          selectedRespondent: 1,
          respondents: [
            {
              respondentNumber: 1,
              respondentName: 'Name',
            },
          ],
        },
      })
    ).get(PageUrls.WORK_ADDRESS);
    expect(res.type).toEqual('text/html');
    expect(res.status).toEqual(200);
  });
});

describe(`on POST ${PageUrls.WORK_ADDRESS}`, () => {
  test('should load acas number page if yes is selected', async () => {
    await request(mockApp({}))
      .post(PageUrls.WORK_ADDRESS)
      .send({ claimantWorkAddressQuestion: YesOrNo.YES })
      .expect(res => {
        expect(res.status).toEqual(302);
        expect(res.header['location']).toEqual(PageUrls.ACAS_CERT_NUM);
      });
  });

  test('should load place of work page if no is selected', async () => {
    await request(mockApp({}))
      .post(PageUrls.WORK_ADDRESS)
      .send({ claimantWorkAddressQuestion: YesOrNo.NO })
      .expect(res => {
        expect(res.status).toEqual(302);
        expect(res.header['location']).toEqual(PageUrls.PLACE_OF_WORK);
      });
  });
});

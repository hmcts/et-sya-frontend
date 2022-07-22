import request from 'supertest';

import { YesOrNo } from '../../main/definitions/case';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

const pageUrl = '/respondent/1/acas-cert-num';

describe(`GET ${PageUrls.ACAS_CERT_NUM}`, () => {
  it('should return the do you have an Acas cert number page', async () => {
    const res = await request(
      mockApp({
        userCase: {
          respondents: [
            {
              respondentNumber: 1,
              respondentName: 'Name',
            },
          ],
        },
      })
    ).get(pageUrl);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.ACAS_CERT_NUM}`, () => {
  test('should go to the types of claim page when the Yes radio button is selected', async () => {
    await request(mockApp({}))
      .post(pageUrl)
      .send({ acasCert: YesOrNo.YES })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.RESPONDENT_DETAILS_CHECK);
      });
  });

  test('should go to the no valid acas page when the No radio button is selected', async () => {
    await request(mockApp({}))
      .post(pageUrl)
      .send({ acasCert: YesOrNo.NO })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual('/respondent/1/no-acas-reason');
      });
  });
});

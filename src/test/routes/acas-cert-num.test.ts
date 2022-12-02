import request from 'supertest';

import * as helper from '../../main/controllers/helpers/CaseHelpers';
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
  jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());
  test('should go to the types of claim page when the Yes radio button is selected', async () => {
    await request(mockApp({}))
      .post(pageUrl)
      .send({ acasCertNum: 'R123222/21/31', acasCert: YesOrNo.YES })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.RESPONDENT_DETAILS_CHECK);
      });
  });

  test('should navigage to the same acas-cert-num page when invalid acasCertNum entered', async () => {
    await request(mockApp({}))
      .post(pageUrl)
      .send({ acasCertNum: 'R123222//2131', acasCert: YesOrNo.YES })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toContain(PageUrls.ACAS_CERT_NUM);
      });
  });

  test('should navigage to your claim has been saved page when save as draft clicked', async () => {
    await request(mockApp({}))
      .post(pageUrl)
      .send({ saveForLater: true })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.CLAIM_SAVED);
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

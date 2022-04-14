import request from 'supertest';

import { app } from '../../main/app';
import { PageUrls } from '../../main/definitions/constants';
import { ClaimOutcomes } from '../../main/definitions/definition';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.COMPENSATION_OUTCOME}`, () => {
  it('should return the acas single claim page', async () => {
    const res = await request(app).get(PageUrls.COMPENSATION_OUTCOME);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.COMPENSATION_OUTCOME}`, () => {
  test(`should continue to tribunal recommendation outcome when ${ClaimOutcomes.TRIBUNAL_RECOMMENDATION} has been selected`, async () => {
    await request(
      mockApp({
        userCase: {
          claimOutcome: [ClaimOutcomes.TRIBUNAL_RECOMMENDATION],
        },
      })
    )
      .post(PageUrls.COMPENSATION_OUTCOME)
      .send({})
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.TRIBUNAL_RECOMMENDATION_OUTCOME);
      });
  });
  test('should go to claim steps page when other outcomes have been selected', async () => {
    await request(
      mockApp({
        userCase: {
          claimOutcome: [ClaimOutcomes.COMPENSATION, ClaimOutcomes.OLD_JOB, ClaimOutcomes.ANOTHER_JOB],
        },
      })
    )
      .post(PageUrls.COMPENSATION_OUTCOME)
      .send({})
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.CLAIM_STEPS);
      });
  });
  test('should go to claim steps page when nothing has been selected', async () => {
    await request(app)
      .post(PageUrls.COMPENSATION_OUTCOME)
      .send({})
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.CLAIM_STEPS);
      });
  });
});

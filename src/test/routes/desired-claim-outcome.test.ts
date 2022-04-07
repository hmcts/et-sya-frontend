import request from 'supertest';

import { app } from '../../main/app';
import { PageUrls } from '../../main/definitions/constants';
import { ClaimOutcomes } from '../../main/definitions/definition';

describe(`GET ${PageUrls.DESIRED_CLAIM_OUTCOME}`, () => {
  it('should return the desired claim outcome page', async () => {
    const res = await request(app).get(PageUrls.DESIRED_CLAIM_OUTCOME);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`POST ${PageUrls.DESIRED_CLAIM_OUTCOME}`, () => {
  test(`${ClaimOutcomes.COMPENSATION} outcome should go to compensation outcome page`, async () => {
    await request(app)
      .post(PageUrls.DESIRED_CLAIM_OUTCOME)
      .send({
        claimOutcome: [ClaimOutcomes.COMPENSATION],
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.COMPENSATION_OUTCOME);
      });
  });
  test(`${ClaimOutcomes.TRIBUNAL_RECOMMENDATION} outcome should go to tribunal recommendation outcome page`, async () => {
    await request(app)
      .post(PageUrls.DESIRED_CLAIM_OUTCOME)
      .send({
        claimOutcome: [ClaimOutcomes.TRIBUNAL_RECOMMENDATION],
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.TRIBUNAL_RECOMMENDATION_OUTCOME);
      });
  });
  test('other outcomes should go back to claim steps page', async () => {
    await request(app)
      .post(PageUrls.DESIRED_CLAIM_OUTCOME)
      .send({
        claimOutcome: [ClaimOutcomes.OLD_JOB, ClaimOutcomes.ANOTHER_JOB],
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.CLAIM_STEPS);
      });
  });
});

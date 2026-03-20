import request from 'supertest';

import { app } from '../../main/app';
import { ReturnToExistingOption } from '../../main/definitions/case';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.RETURN_TO_EXISTING}`, () => {
  it('should go to the return to existing claim page', async () => {
    const res = await request(mockApp({})).get(PageUrls.RETURN_TO_EXISTING);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.RETURN_TO_EXISTING}`, () => {
  test('should go to legacy ET page when RETURN_NUMBER option is selected', async () => {
    await request(mockApp({}))
      .post(PageUrls.RETURN_TO_EXISTING)
      .send({ returnToExisting: ReturnToExistingOption.RETURN_NUMBER })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual('https://et-pet-et1.aat.platform.hmcts.net');
      });
  });

  test('should go to claimant applications when HAVE_ACCOUNT option is selected', async () => {
    await request(app)
      .post(PageUrls.RETURN_TO_EXISTING)
      .send({ returnToExisting: ReturnToExistingOption.HAVE_ACCOUNT })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.CLAIMANT_APPLICATIONS);
      });
  });

  test('should go to case number check page when CLAIM_BUT_NO_ACCOUNT option is selected', async () => {
    await request(app)
      .post(PageUrls.RETURN_TO_EXISTING)
      .send({ returnToExisting: ReturnToExistingOption.CLAIM_BUT_NO_ACCOUNT })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.CASE_NUMBER_CHECK);
      });
  });
});

import request from 'supertest';

import { app } from '../../main/app';
import { ReturnToExistingOption } from '../../main/definitions/case';
import { LegacyUrls, PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.RETURN_TO_EXISTING}`, () => {
  it('should go to the return to existing claim page', async () => {
    const res = await request(mockApp({})).get(PageUrls.RETURN_TO_EXISTING);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.RETURN_TO_EXISTING}`, () => {
  test('should go to legacy ET sign-in when draft claim and RETURN_NUMBER sub-option selected', async () => {
    await request(mockApp({}))
      .post(PageUrls.RETURN_TO_EXISTING)
      .send({
        returnToExisting: ReturnToExistingOption.DRAFT_CLAIM,
        draftClaimOption: ReturnToExistingOption.RETURN_NUMBER,
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(`${LegacyUrls.ET1_BASE}${LegacyUrls.ET1_SIGN_IN}`);
      });
  });

  test('should go to claimant applications when draft claim and HAVE_ACCOUNT sub-option selected', async () => {
    await request(mockApp({}))
      .post(PageUrls.RETURN_TO_EXISTING)
      .send({
        returnToExisting: ReturnToExistingOption.DRAFT_CLAIM,
        draftClaimOption: ReturnToExistingOption.HAVE_ACCOUNT,
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.CLAIMANT_APPLICATIONS);
      });
  });

  test('should go to claimant applications when submitted claim and HAVE_ACCOUNT sub-option selected', async () => {
    await request(app)
      .post(PageUrls.RETURN_TO_EXISTING)
      .send({
        returnToExisting: ReturnToExistingOption.SUBMITTED_CLAIM,
        submittedClaimOption: ReturnToExistingOption.HAVE_ACCOUNT,
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.CLAIMANT_APPLICATIONS);
      });
  });

  test('should go to case number check when submitted claim and CLAIM_BUT_NO_ACCOUNT sub-option selected', async () => {
    await request(app)
      .post(PageUrls.RETURN_TO_EXISTING)
      .send({
        returnToExisting: ReturnToExistingOption.SUBMITTED_CLAIM,
        submittedClaimOption: ReturnToExistingOption.CLAIM_BUT_NO_ACCOUNT,
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.CASE_NUMBER_CHECK);
      });
  });
});

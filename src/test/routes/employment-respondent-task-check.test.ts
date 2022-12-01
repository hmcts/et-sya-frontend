import request from 'supertest';

import * as helper from '../../main/controllers/helpers/CaseHelpers';
import { YesOrNo } from '../../main/definitions/case';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.EMPLOYMENT_RESPONDENT_TASK_CHECK}`, () => {
  it('should return the task list check page', async () => {
    const res = await request(mockApp({})).get(PageUrls.EMPLOYMENT_RESPONDENT_TASK_CHECK);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`POST ${PageUrls.EMPLOYMENT_RESPONDENT_TASK_CHECK}`, () => {
  jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementationOnce(() => Promise.resolve());
  test('should go to the claim steps page', async () => {
    await request(mockApp({}))
      .post(PageUrls.EMPLOYMENT_RESPONDENT_TASK_CHECK)
      .send({ employmentAndRespondentCheck: YesOrNo.NO })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.CLAIM_STEPS);
      });
  });
});

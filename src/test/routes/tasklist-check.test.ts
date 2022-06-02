import request from 'supertest';

import { YesOrNo } from '../../main/definitions/case';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.TASK_LIST_CHECK}`, () => {
  it('should return the task list check page', async () => {
    const res = await request(mockApp({})).get(PageUrls.TASK_LIST_CHECK);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`POST ${PageUrls.TASK_LIST_CHECK}`, () => {
  test('should go to the claim steps page', async () => {
    await request(mockApp({}))
      .post(PageUrls.TASK_LIST_CHECK)
      .send({ tasklistCheck: YesOrNo.NO })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.CLAIM_STEPS);
      });
  });
});

import * as helper from '../../main/controllers/helpers/CaseHelpers';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

import request from 'supertest';

describe(`GET ${PageUrls.JOB_TITLE}`, () => {
  it('should return the job title page', async () => {
    const res = await request(mockApp({})).get(PageUrls.JOB_TITLE);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.JOB_TITLE}`, () => {
  jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementationOnce(() => Promise.resolve());
  test('should navigate to the start date page when a job title is entered', async () => {
    await request(mockApp({}))
      .post(PageUrls.JOB_TITLE)
      .send({
        jobTitle: 'Vice President Branch Co-Manager',
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.START_DATE);
      });
  });
});

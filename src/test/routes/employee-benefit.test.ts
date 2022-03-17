import request from 'supertest';

import { app } from '../../main/app';
import { PageUrls } from '../../main/definitions/constants';

describe(`GET, ${PageUrls.EMPLOYEE_BENEFIT}`, () => {
  it('should return employee benefit page', async () => {
    const res = await request(app).get(PageUrls.EMPLOYEE_BENEFIT);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

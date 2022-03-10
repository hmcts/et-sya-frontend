import request from 'supertest';

import { app } from '../../main/app';
import { YesOrNo } from '../../main/definitions/case';
import { PageUrls } from '../../main/definitions/constants';

describe('GET /past-employer', () => {
  it('should return the did you work for the employer page', async () => {
    const res = await request(app).get(PageUrls.PAST_EMPLOYER);
    expect(res.type).toEqual('text/html');
    expect(res.status).toEqual(200);
  });
});

describe('on POST /past-employer with Yes', () => {
  test('should reload the current page when the Yes radio button is selected', async () => {
    await request(app)
      .post(PageUrls.PAST_EMPLOYER)
      .send({ pastEmployer: YesOrNo.YES })
      .expect(res => {
        expect(res.status).toEqual(302);
        expect(res.header['location']).toEqual(PageUrls.STILL_WORKING);
      });
  });
});

describe('on POST /past-employer with No', () => {
  test('should reload the current page when the No radio button is selected', async () => {
    await request(app)
      .post(PageUrls.PAST_EMPLOYER)
      .send({ pastEmployer: YesOrNo.NO })
      .expect(res => {
        expect(res.status).toEqual(302);
        expect(res.header['location']).toEqual(PageUrls.HOME);
      });
  });
});

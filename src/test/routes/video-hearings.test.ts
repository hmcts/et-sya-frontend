import request from 'supertest';

import { app } from '../../main/app';
import { YesOrNo } from '../../main/definitions/case';

describe('GET /would-you-want-to-take-part-in-video-hearings', () => {
  it('should return the video hearing choice page', async () => {
    const res = await request(app).get('/would-you-want-to-take-part-in-video-hearings');
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe('on POST /would-you-want-to-take-part-in-video-hearings', () => {
  test("should return the steps to making a claim page when 'yes' and 'save and continue' are selected", async () => {
    await request(app)
      .post('/would-you-want-to-take-part-in-video-hearings')
      .send({ videoHearings: YesOrNo.YES })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual('/steps-to-making-your-claim');
      });
  });

  test("should return the steps to making a claim page when 'no' and 'save and continue' are selected", async () => {
    await request(app)
      .post('/would-you-want-to-take-part-in-video-hearings')
      .send({ videoHearings: YesOrNo.NO })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual('/steps-to-making-your-claim');
      });
  });
});

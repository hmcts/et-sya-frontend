import { expect } from 'chai';
import { YesOrNo } from 'definitions/case';
import request from 'supertest';

import { app } from '../../main/app';

describe('GET /would-you-want-to-take-part-in-video-hearings', () => {
  it('should return the video hearing choice page', async () => {
    const res = await request(app).get('/would-you-want-to-take-part-in-video-hearings');
    expect(res.type).to.equal('text/html');
    expect(res.status).to.equal(200);
  });
});

describe('on POST /would-you-want-to-take-part-in-video-hearings', () => {
  test('should return the steps to making a claim page when \'yes\' and \'save and continue\' are selected', async () => {
    await request(app)
      .post('/would-you-want-to-take-part-in-video-hearings')
      .send({ videoHearings: YesOrNo.YES })
      .expect((res) => {
        expect(res.status).to.equal(302);
        expect(res.header['location']).to.equal('/steps-to-making-your-claim');
      });
  });
});

describe('on POST /would-you-want-to-take-part-in-video-hearings', () => {
  test('should return the steps to making a claim page when \'no\' and \'save and continue\' are selected', async () => {
    await request(app)
      .post('/would-you-want-to-take-part-in-video-hearings')
      .send({ videoHearings: YesOrNo.NO })
      .expect((res) => {
        expect(res.status).to.equal(302);
        expect(res.header['location']).to.equal('/steps-to-making-your-claim');
      });
  });
});
import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

describe('GET /video-hearing', () => {
  it('should return the video hearing choice page', async () => {
    const res = await request(app).get('/video-hearing');
    expect(res.type).to.equal('text/html');
    expect(res.status).to.equal(200);
  });
});

describe('on POST /video-hearing', () => {
  test('should return the steps to making a claim page when \'yes\' is selected', async () => {
    await request(app)
      .post('/video-hearing')
      .send({'video-hearing': 'yes'})
      .expect((res) => {
        expect(res.status).to.equal(302);
        expect(res.header['location']).to.equal('/steps-to-making-your-claim');
      });
  });
});

describe('on POST /video-hearing', () => {
  test('should return the steps to making a claim page when \'no\' is selected', async () => {
    await request(app)
      .post('/video-hearing')
      .send({'video-hearing': 'no'})
      .expect((res) => {
        expect(res.status).to.equal(302);
        expect(res.header['location']).to.equal('/steps-to-making-your-claim');
      });
  });
});
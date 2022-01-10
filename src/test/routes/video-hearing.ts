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
  test('should return the steps to making a claim page when \'yes\' and \'save and continue\' are selected', async () => {
    await request(app)
      .post('/video-hearing')
      .send({'video-hearing': 'yes', 'saveAndContinue':'saveAndContinue'})
      .expect((res) => {
        expect(res.status).to.equal(302);
        expect(res.header['location']).to.equal('/steps-to-making-your-claim');
      });
  });
});

describe('on POST /video-hearing', () => {
  test('should return the steps to making a claim page when \'no\' and \'save and continue\' are selected', async () => {
    await request(app)
      .post('/video-hearing')
      .send({'video-hearing': 'no', 'saveAndContinue':'saveAndContinue'})
      .expect((res) => {
        expect(res.status).to.equal(302);
        expect(res.header['location']).to.equal('/steps-to-making-your-claim');
      });
  });
});

describe('on POST /video-hearing', () => {
  test('should return the steps to making a claim page when \'yes\' and \'save for later\' are selected', async () => {
    await request(app)
      .post('/video-hearing')
      .send({'video-hearing': 'yes', 'saveForLater':'saveForLater'})
      .expect((res) => {
        expect(res.status).to.equal(302);
        expect(res.header['location']).to.equal('/your-claim-has-been-saved');
      });
  });
});

describe('on POST /video-hearing', () => {
  test('should return the steps to making a claim page when \'no\' and \'save for later\' are selected', async () => {
    await request(app)
      .post('/video-hearing')
      .send({'video-hearing': 'no', 'saveForLater':'saveForLater'})
      .expect((res) => {
        expect(res.status).to.equal(302);
        expect(res.header['location']).to.equal('/your-claim-has-been-saved');
      });
  });
});

describe('on POST /video-hearing', () => {
  test('should return the \'your claim has been saved\' page when \'save for later\' is selected without selecting a radio button', async () => {
    await request(app)
      .post('/video-hearing')
      .send({'video-hearing': '', 'saveForLater':'saveForLater'})
      .expect((res) => {
        expect(res.status).to.equal(302);
        expect(res.header['location']).to.equal('/your-claim-has-been-saved');
      });
  });
});
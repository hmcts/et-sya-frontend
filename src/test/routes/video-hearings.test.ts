import { expect } from 'chai';
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
      .send({'video-hearing': 'yes', 'saveButton':'saveContinue'})
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
      .send({'video-hearing': 'no', 'saveButton':'saveContinue'})
      .expect((res) => {
        expect(res.status).to.equal(302);
        expect(res.header['location']).to.equal('/steps-to-making-your-claim');
      });
  });
});

describe('on POST /would-you-want-to-take-part-in-video-hearings', () => {
  test('should return the steps to making a claim page when \'yes\' and \'save for later\' are selected', async () => {
    await request(app)
      .post('/would-you-want-to-take-part-in-video-hearings')
      .send({'video-hearing': 'yes', 'saveButton':'saveForLater'})
      .expect((res) => {
        expect(res.status).to.equal(302);
        expect(res.header['location']).to.equal('/your-claim-has-been-saved');
      });
  });
});

describe('on POST /would-you-want-to-take-part-in-video-hearings', () => {
  test('should return the steps to making a claim page when \'no\' and \'save for later\' are selected', async () => {
    await request(app)
      .post('/would-you-want-to-take-part-in-video-hearings')
      .send({'video-hearing': 'no', 'saveButton':'saveForLater'})
      .expect((res) => {
        expect(res.status).to.equal(302);
        expect(res.header['location']).to.equal('/your-claim-has-been-saved');
      });
  });
});

describe('on POST /would-you-want-to-take-part-in-video-hearings', () => {
  test('should return the \'your claim has been saved\' page when \'save for later\' is selected without selecting a radio button', async () => {
    await request(app)
      .post('/would-you-want-to-take-part-in-video-hearings')
      .send({'video-hearing': '', 'saveButton':'saveForLater'})
      .expect((res) => {
        expect(res.status).to.equal(302);
        expect(res.header['location']).to.equal('/your-claim-has-been-saved');
      });
  });
});
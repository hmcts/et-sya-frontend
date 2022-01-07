import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

describe('GET /how-would-you-like-to-be-updated-about-your-claim', () => {
  it('should return the how would you like to be updated about your claim page', async () => {
    const res = await request(app).get('/how-would-you-like-to-be-updated-about-your-claim');
    expect(res.type).to.equal('text/html');
    expect(res.status).to.equal(200);
  });
});

describe('on POST /how-would-you-like-to-be-updated-about-your-claim', () => {
  test('should return the video hearings page when the \'Email\' option is selected and \'Save and Continue\' button pressed', async () => {
    await request(app)
      .post('/how-would-you-like-to-be-updated-about-your-claim')
      .send({'update-preference': 'email', 'saveButton' : 'saveContinue'})
      .expect((res) => {
        expect(res.status).to.equal(302);
        expect(res.header['location']).to.equal('/would-you-want-to-take-part-in-video-hearings');
      });
  });
});

describe('on POST /how-would-you-like-to-be-updated-about-your-claim', () => {
  test('should return the video hearings page when the \'Post\' option is selected and \'Save and Continue\' button pressed', async () => {
    await request(app)
      .post('/how-would-you-like-to-be-updated-about-your-claim')
      .send({'update-preference': 'post', 'saveButton' : 'saveContinue'})
      .expect((res) => {
        expect(res.status).to.equal(302);
        expect(res.header['location']).to.equal('/would-you-want-to-take-part-in-video-hearings');
      });
  });
});

describe('on POST /how-would-you-like-to-be-updated-about-your-claim', () => {
  test('should return the claim saved page when the \'Email\' option is selected and \'Save for later\' button pressed', async () => {
    await request(app)
      .post('/how-would-you-like-to-be-updated-about-your-claim')
      .send({'update-preference': 'email', 'saveButton' : 'saveForLater'})
      .expect((res) => {
        expect(res.status).to.equal(302);
        expect(res.header['location']).to.equal('/your-claim-has-been-saved');
      });
  });
});

describe('on POST /how-would-you-like-to-be-updated-about-your-claim', () => {
  test('should return the claim saved page when the \'Post\' option is selected and \'Save for later\' button pressed', async () => {
    await request(app)
      .post('/how-would-you-like-to-be-updated-about-your-claim')
      .send({'update-preference': 'post', 'saveButton' : 'saveForLater'})
      .expect((res) => {
        expect(res.status).to.equal(302);
        expect(res.header['location']).to.equal('/your-claim-has-been-saved');
      });
  });
});
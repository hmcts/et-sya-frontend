import request from 'supertest';
import * as helper from '../../main/controllers/helpers/CaseHelpers';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

const pageUrl = '/respondent/1/place-of-work';

// Log how node-fetch is resolved before mocking
console.log('Before mock - node-fetch: ', require('node-fetch'));
jest.mock('node-fetch', () => jest.fn());
// Log how node-fetch is resolved after mocking
console.log('After mock - node-fetch: ', require('node-fetch'));

describe(`GET ${PageUrls.PLACE_OF_WORK}`, () => {
  it('should go to place of work page', async () => {
    // Log options passed to mockApp
    console.log('mockApp options: ', mockApp({}));

    const res = await request(mockApp({})).get(pageUrl);
    // Log request and response
    console.log('Response: ', res);
    // Check if status is 500 here
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.PLACE_OF_WORK}`, () => {
  jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementationOnce(() => Promise.resolve());
  test('should redirect to acas number page on submit', async () => {
    await request(mockApp({}))
      .post(pageUrl)
      .send({
        /* ... */
      })
      .expect(res => {
        // Log response
        console.log('Response: ', res);
        expect(res.status).toEqual(302);
        expect(res.header['location']).toEqual('/respondent/1/acas-cert-num');
      });
  });
});

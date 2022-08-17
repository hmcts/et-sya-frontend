import { expect } from 'chai';
import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.SELECTED_APPLICATION + '/newClaim'}`, () => {
  it('should return to home page if new claim', async () => {
    const res = await request(mockApp({})).get('/claimant-application/newClaim');
    expect(res.header['location']).equal(PageUrls.HOME);
  });
});

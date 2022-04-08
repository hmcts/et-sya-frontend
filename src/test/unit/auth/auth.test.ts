import Axios, { AxiosStatic } from 'axios';
import config from 'config';

import { getRedirectUrl, getUserDetails } from '../../../main/auth';
import { AuthUrls } from '../../../main/definitions/constants';

jest.mock('axios');

const mockedAxios = Axios as jest.Mocked<AxiosStatic>;
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIiwiZ2l2ZW5fbmFtZSI6IkpvaG4iLCJmYW1pbHlfbmFtZSI6IkRvcmlhbiIsInVpZCI6IjEyMyJ9.KaDIFSDdD3ZIYCl_qavvYbQ3a4abk47iBOZhB1-9mUQ';
const loginUrl = config.get('services.idam.authorizationURL');
const guid = '4e3cac74-d8cf-4de9-ad20-cf6248ba99aa';

describe('getRedirectUrl', () => {
  test('should create a valid URL to redirect to the login screen', () => {
    expect(getRedirectUrl('http://localhost', AuthUrls.CALLBACK, guid)).toBe(
      `${loginUrl}?client_id=et-sya&response_type=code&redirect_uri=http://localhost/oauth2/callback&state=${guid}`
    );
  });
});

describe('getUserDetails', () => {
  test('should exchange a code for a token and decode a JWT to get the user details', async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        access_token: token,
        id_token: token,
      },
    });

    const result = await getUserDetails('http://localhost', '123', AuthUrls.CALLBACK);
    expect(result).toStrictEqual({
      accessToken: token,
      email: 'test@test.com',
      givenName: 'John',
      familyName: 'Dorian',
      id: '123',
    });
  });
});

import AxiosForMock, { AxiosStatic } from 'axios';
import config from 'config';

import { getRedirectUrl, getUserDetails } from '../../../main/auth';
import { AuthUrls, languages } from '../../../main/definitions/constants';

jest.mock('axios');

const mockedAxios = AxiosForMock as jest.Mocked<AxiosStatic>;
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIiwiZ2l2ZW5fbmFtZSI6IkpvaG4iLCJmYW1pbHlfbmFtZSI6IkRvcmlhbiIsInVpZCI6IjEyMyJ9.KaDIFSDdD3ZIYCl_qavvYbQ3a4abk47iBOZhB1-9mUQ';
const citizenToken =
  'eyJ0eXAiOiJKV1QiLCJraWQiOiIxZXIwV1J3Z0lPVEFGb2pFNHJDL2ZiZUt1M0k9IiwiYWxnIjoiUlMyNTYifQ.eyJhdF9oYXNoIjoiajIyZzNtZ1BEUkpIMDRDU0laTnBJZyIsInN1YiI6ImNpdGl6ZW4tdXNlckB0ZXN0LmNvLnVrIiwiYXVkaXRUcmFja2luZ0lkIjoiZjM0ZTZjOWMtZmRmYi00NDRmLWFjNjYtZWQxZmQ2NjAxZWIzLTQ2MjU0MDEwIiwicm9sZXMiOlsiY2l0aXplbiIsImNhc2V3b3JrZXItZW1wbG95bWVudC1hcGkiLCJjYXNld29ya2VyLWVtcGxveW1lbnQiLCJjYXNld29ya2VyLWVtcGxveW1lbnQtZW5nbGFuZHdhbGVzIiwiY2FzZXdvcmtlciJdLCJpc3MiOiJodHRwczovL2Zvcmdlcm9jay1hbS5zZXJ2aWNlLmNvcmUtY29tcHV0ZS1pZGFtLWFhdDIuaW50ZXJuYWw6ODQ0My9vcGVuYW0vb2F1dGgyL3JlYWxtcy9yb290L3JlYWxtcy9obWN0cyIsInRva2VuTmFtZSI6ImlkX3Rva2VuIiwiZ2l2ZW5fbmFtZSI6IkNpdGl6ZW4iLCJhdWQiOiJobWN0cyIsInVpZCI6ImE0Mzk2YjEwLTY5MjgtNDcxMS1hM2JhLTg5ZmNmNmFkYjc3OSIsImF6cCI6ImhtY3RzIiwiYXV0aF90aW1lIjoxNjUzNDkyMzkzLCJuYW1lIjoiQ2l0aXplbiBUZXN0ZXIiLCJyZWFsbSI6Ii9obWN0cyIsImV4cCI6MTY1MzQ5NTk5MywidG9rZW5UeXBlIjoiSldUVG9rZW4iLCJpYXQiOjE2NTM0OTIzOTMsImZhbWlseV9uYW1lIjoiVGVzdGVyIn0.KTfxz0oMqSqwRkcPczZISwp5hOP_RLcopqu9mOIdARg1TiZhzEnueo8_ppSrzb6YZRLmhO65K-hsqjBX1gE_oSN_975i5mfE3gBd1B_vCvEtS3YFLc_ReLiSTRW9Y0AelPzKOMqW2E0yFU_1IdCBrq3-rtQK2e1sAD8vVOIRF9ooih9mi3vUnD6kevDj099u_aE7qy_ueClt37CWhQ1achOxb11EeVYjv4K48TG1TxiBtIJx2H2b5lZayQuAPd8Jn4SEXXLCvhbt5K61L7NFZh0UiNfRjySwfIPX9MIovUPsGvnK4zJ6a4fqJU0SIl6v5wN5WMXp0u1YUzx7fzIoww';
const loginUrl = process.env.IDAM_WEB_URL ?? config.get('services.idam.authorizationURL');
const guid = '4e3cac74-d8cf-4de9-ad20-cf6248ba99aa';
const languageParam = languages.ENGLISH;

describe('getRedirectUrl', () => {
  test('should create a valid URL to redirect to the login screen', () => {
    expect(getRedirectUrl('http://localhost', AuthUrls.CALLBACK, guid, languageParam)).toBe(
      `${loginUrl}?client_id=et-sya&response_type=code&redirect_uri=http://localhost/oauth2/callback&state=${guid}&ui_locales=${languageParam}`
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
      isCitizen: false,
    });
  });

  test('should get user details of a citizen user from the JWT token', async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        access_token: citizenToken,
        id_token: citizenToken,
      },
    });

    const result = await getUserDetails('http://localhost', '123', AuthUrls.CALLBACK);
    expect(result).toStrictEqual({
      accessToken: citizenToken,
      email: 'citizen-user@test.co.uk',
      givenName: 'Citizen',
      familyName: 'Tester',
      id: 'a4396b10-6928-4711-a3ba-89fcf6adb779',
      isCitizen: true,
    });
  });

  test('should throw an error if the exchange for a token fails', async () => {
    const error = new Error('Network Error');
    mockedAxios.post.mockRejectedValue(error);

    await expect(getUserDetails('http://localhost', '123', AuthUrls.CALLBACK)).rejects.toThrow(
      'Error getting user details from IDAM: Network Error'
    );
  });
});

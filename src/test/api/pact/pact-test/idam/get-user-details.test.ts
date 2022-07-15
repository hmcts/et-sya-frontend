import { HTTPMethod } from '@pact-foundation/pact/src/common/request';
import { pactWith } from 'jest-pact';

import { IdTokenJwtPayload } from '../../../../../main/auth';
import { idamGetUserDetails } from '../../pactUtil';
import { PactTestSetup } from '../settings/provider.mock';

const { Matchers } = require('@pact-foundation/pact');
const { somethingLike } = Matchers;
const pactSetUp = new PactTestSetup({ provider: 'Idam_api', port: 8000 });
pactWith({ consumer: 'ET-SYA', provider: 'Idam_api' }, () => {
  describe('Movies Service', () => {
    const RESPONSE_BODY = {
      uid: somethingLike('abc123'),
      given_name: somethingLike('Joe'),
      family_name: somethingLike('Bloggs'),
      sub: somethingLike('joe.bloggs@hmcts.net'),
      roles: somethingLike([somethingLike('solicitor'), somethingLike('caseworker')]),
    };

    pactSetUp.provider.setup().then(() => {
      pactSetUp.provider.addInteraction({
        state: 'a valid user exists',
        uponReceiving: 'a request for that user',
        withRequest: {
          method: HTTPMethod.GET,
          path: '/details',
          headers: {
            Authorization: 'Bearer some-access-token',
          },
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: RESPONSE_BODY,
        },
      });
    });
  });
  // eslint-disable-next-line jest/expect-expect
  test('Returns the user details from IDAM', () => {
    const taskUrl = `${pactSetUp.provider.mockService.baseUrl}/details`;
    idamGetUserDetails(taskUrl)
      .then((axiosResponse: { data: IdTokenJwtPayload }) => {
        const dto: IdTokenJwtPayload = axiosResponse.data;
        assertResponses(dto);
      })
      .then(() => {
        pactSetUp.provider.verify().then(() => {
          pactSetUp.provider.finalize();
        });
      });
  });
});
function assertResponses(dto: IdTokenJwtPayload) {
  expect(dto.uid).toStrictEqual('abc123');
  expect(dto.sub).toStrictEqual('joe.bloggs@hmcts.net');
  expect(dto.given_name).toStrictEqual('Joe');
  expect(dto.family_name).toStrictEqual('Bloggs');
  expect(dto.roles[0]).toStrictEqual('solicitor');
  expect(dto.roles[1]).toStrictEqual('caseworker');
}


import config from 'config';
import { v4 as uuid } from 'uuid';

import { Applicant } from '../../../main/definitions/constants';
import { createToken } from '../../../main/pcq/createToken';

jest.mock('config');

const mockedConfig = config as jest.Mocked<typeof config>;

describe('createToken', () => {
  const params = {
    serviceId: 'ET',
    actor: Applicant.CLAIMANT,
    pcqId: uuid(),
    ccdCaseId: '1234',
    partyId: 'test@hmcts.net',
    returnUrl: 'http://localhost:3100/test',
    language: 'en',
  };

  test('Should create token if tokenKey exists', () => {
    mockedConfig.get.mockReturnValueOnce('xyzpkstu');
    const result = createToken(params);
    expect(result).toHaveLength(374);
  });
});

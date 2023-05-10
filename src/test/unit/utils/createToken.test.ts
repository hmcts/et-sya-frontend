import config from 'config';
import { v4 as uuidv4 } from 'uuid';

import { createToken } from '../../../main/pcq/createToken';

jest.mock('config');

const mockedConfig = config as jest.Mocked<typeof config>;

describe('createToken', () => {
  const params = {
    serviceId: 'ET',
    actor: 'Claimant',
    pcqId: uuidv4(),
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

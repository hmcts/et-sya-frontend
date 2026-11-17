jest.mock('@hmcts/cui-client', () => ({
  CUIActions: {
    SUBMIT: 'submit',
  },
  CUIClient: jest.fn(),
  mergeCUIFlagItems: jest.fn(),
}));

jest.mock('config', () => ({
  get: jest.fn(),
}));

import { CUIClient } from '@hmcts/cui-client';
import config from 'config';

import { getCuiService } from '../../../main/services/CuiService';

const configGetMock = config.get as jest.Mock;
const cuiClientMock = CUIClient as jest.Mock;

describe('CuiService', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const cuiConfig = {
    apiUrl: 'https://cui.example.test',
    serviceId: 'et-sya',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    configGetMock.mockReturnValue(cuiConfig);
    process.env.NODE_ENV = originalNodeEnv;
  });

  afterAll(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('should create a development CUI client with relaxed TLS and a logout URL', () => {
    process.env.NODE_ENV = 'development';

    getCuiService('/logout');

    expect(cuiClientMock).toHaveBeenCalledWith(
      {
        ...cuiConfig,
        logoutUrl: '/logout',
      },
      expect.objectContaining({
        axiosConfig: expect.objectContaining({
          httpsAgent: expect.objectContaining({
            options: expect.objectContaining({
              rejectUnauthorized: false,
            }),
          }),
        }),
      })
    );
  });

  it('should create a non-development CUI client without development axios options', () => {
    process.env.NODE_ENV = 'production';

    getCuiService();

    expect(cuiClientMock).toHaveBeenCalledWith(cuiConfig);
  });

  it('should reject missing CUI configuration', () => {
    configGetMock.mockReturnValue(undefined);

    expect(() => getCuiService()).toThrow('Missing required configuration for CUI service');
  });
});

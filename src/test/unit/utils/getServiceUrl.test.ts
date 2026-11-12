jest.mock('config', () => ({
  get: jest.fn(),
}));

import config from 'config';
import { Request } from 'express';

import { getServiceUrl } from '../../../main/utils/getServiceUrl';

const configGetMock = config.get as jest.Mock;

describe('getServiceUrl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    configGetMock.mockReturnValue(3002);
  });

  it('should use the forwarded host and configured port in development mode', () => {
    const req = {
      app: {
        locals: {
          developmentMode: true,
        },
      },
      headers: {
        'x-forwarded-host': 'claim.example.test',
      },
      hostname: 'internal.example.test',
    } as unknown as Request;

    expect(getServiceUrl(req, '/your-support/callback')).toBe('https://claim.example.test:3002/your-support/callback');
  });

  it('should use the request hostname without a port outside development mode', () => {
    const req = {
      app: {
        locals: {
          developmentMode: false,
        },
      },
      headers: {},
      hostname: 'claim.example.test',
    } as unknown as Request;

    expect(getServiceUrl(req)).toBe('https://claim.example.test');
  });
});

jest.mock('otplib', () => {
  const generate = jest.fn();
  return {
    __mockGenerateOtp: generate,
    OTP: jest.fn().mockImplementation(() => ({
      generate,
    })),
    createGuardrails: jest.fn().mockReturnValue('guardrails'),
  };
});

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
  isAxiosError: jest.fn(),
}));

jest.mock('config', () => ({
  get: jest.fn(),
}));

import axios, { isAxiosError } from 'axios';
import config from 'config';

import { S2SService, getS2SService } from '../../../main/services/S2SService';

const axiosPostMock = axios.post as jest.Mock;
const configGetMock = config.get as jest.Mock;
const isAxiosErrorMock = isAxiosError as unknown as jest.Mock;
const { __mockGenerateOtp: mockGenerateOtp } = jest.requireMock('otplib') as { __mockGenerateOtp: jest.Mock };

describe('S2SService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGenerateOtp.mockReturnValue('one-time-password');
    isAxiosErrorMock.mockReturnValue(false);
  });

  it('should generate a one-time token', async () => {
    const service = new S2SService('https://s2s.example.test', 'valid-test-secret', 'et-sya');

    await expect(service.getOneTimeToken()).resolves.toBe('one-time-password');

    expect(mockGenerateOtp).toHaveBeenCalledWith({ secret: 'valid-test-secret' });
  });

  it('should wrap one-time token generation errors with service context', async () => {
    mockGenerateOtp.mockImplementation(() => {
      throw new Error('secret is invalid');
    });
    const service = new S2SService('https://s2s.example.test', 'bad-secret', 'et-sya');

    await expect(service.getOneTimeToken()).rejects.toThrow(
      'Failed to generate one-time token for service "et-sya": secret is invalid'
    );
  });

  it('should lease an S2S token using the generated one-time password', async () => {
    axiosPostMock.mockResolvedValue({ status: 200, data: 'leased-token' });
    const service = new S2SService('https://s2s.example.test', 'valid-test-secret', 'et-sya');

    await expect(service.getToken()).resolves.toBe('leased-token');

    expect(axiosPostMock).toHaveBeenCalledWith('https://s2s.example.test/lease', {
      microservice: 'et-sya',
      oneTimePassword: 'one-time-password',
    });
  });

  it('should reject an unexpected S2S lease status', async () => {
    axiosPostMock.mockResolvedValue({ status: 201, data: 'leased-token' });
    const service = new S2SService('https://s2s.example.test', 'valid-test-secret', 'et-sya');

    await expect(service.getToken()).rejects.toThrow(
      'S2S lease request returned unexpected status 201 from https://s2s.example.test/lease'
    );
  });

  it('should reject an unexpected S2S lease response type', async () => {
    axiosPostMock.mockResolvedValue({ status: 200, data: { token: 'leased-token' } });
    const service = new S2SService('https://s2s.example.test', 'valid-test-secret', 'et-sya');

    await expect(service.getToken()).rejects.toThrow(
      'S2S lease response from https://s2s.example.test/lease had unexpected data type: object'
    );
  });

  it('should include axios response details when a lease request fails', async () => {
    isAxiosErrorMock.mockReturnValue(true);
    axiosPostMock.mockRejectedValue({
      message: 'Request failed',
      response: {
        data: { error: 'service unavailable' },
        status: 503,
      },
    });
    const service = new S2SService('https://s2s.example.test', 'valid-test-secret', 'et-sya');

    await expect(service.getToken()).rejects.toThrow(
      'S2S lease request to https://s2s.example.test/lease failed (status 503): {"error":"service unavailable"}'
    );
  });

  it('should create the configured S2S service', () => {
    configGetMock.mockImplementation((key: string) => {
      const values: Record<string, string> = {
        'services.s2s.secret': 'valid-test-secret',
        'services.s2s.serviceName': 'et-sya',
        'services.s2s.url': 'https://s2s.example.test',
      };
      return values[key];
    });

    expect(getS2SService()).toBeInstanceOf(S2SService);
  });

  it('should reject missing S2S configuration', () => {
    configGetMock.mockImplementation((key: string) => (key === 'services.s2s.url' ? '' : 'configured-value'));

    expect(() => getS2SService()).toThrow(
      'Missing required configuration for S2S service: endpoint, secret, and serviceName must all be provided'
    );
  });
});

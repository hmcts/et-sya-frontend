import axios, { isAxiosError } from 'axios';
import config from 'config';
import { OTP, createGuardrails } from 'otplib';

const otp = new OTP({
  guardrails: createGuardrails({
    MIN_SECRET_BYTES: 10,
  }),
});

export interface IS2SService {
  getOneTimeToken(): Promise<string>;
  getToken(): Promise<string>;
}

export class S2SService implements IS2SService {
  constructor(private endpoint: string, private secret: string, private serviceName: string) {}

  public async getOneTimeToken(): Promise<string> {
    try {
      return await otp.generate({ secret: this.secret });
    } catch (error) {
      throw new Error(
        `Failed to generate one-time token for service "${this.serviceName}": ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  public async getToken(): Promise<string> {
    const url = `${this.endpoint}/lease`;
    const body = {
      microservice: this.serviceName,
      oneTimePassword: await this.getOneTimeToken(),
    };

    try {
      const response = await axios.post(url, body);
      if (response.status !== 200) {
        throw new Error(`S2S lease request returned unexpected status ${response.status} from ${url}`);
      }
      if (typeof response.data !== 'string') {
        throw new Error(`S2S lease response from ${url} had unexpected data type: ${typeof response.data}`);
      }
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const status = error.response?.status ?? 'no response';
        const detail = error.response?.data ? JSON.stringify(error.response.data) : error.message;
        throw new Error(`S2S lease request to ${url} failed (status ${status}): ${detail}`);
      }
      throw error;
    }
  }
}

export const getS2SService = (): IS2SService => {
  const endpoint = config.get<string>('services.s2s.url');
  const secret = config.get<string>('services.s2s.secret');
  const serviceName = config.get<string>('services.s2s.serviceName');
  if (!endpoint || !secret || !serviceName) {
    throw new Error(
      'Missing required configuration for S2S service: endpoint, secret, and serviceName must all be provided'
    );
  }
  return new S2SService(endpoint, secret, serviceName);
};

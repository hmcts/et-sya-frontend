import { AxiosError, AxiosHeaders } from 'axios';

import { axiosErrorDetails } from '../../../main/services/AxiosErrorAdapter';

const createAxiosError = (
  message: string,
  responseData?: unknown,
  status?: number
): AxiosError<{ error: string; message: string }> => {
  const error = new AxiosError(message) as AxiosError<{ error: string; message: string }>;
  if (responseData !== undefined) {
    error.response = {
      data: responseData as { error: string; message: string },
      status: status ?? 500,
      statusText: 'Internal Server Error',
      headers: {},
      config: { headers: new AxiosHeaders() },
    };
  }
  return error;
};

describe('axiosErrorDetails', () => {
  it('should return just the error message when there is no response data', () => {
    const error = createAxiosError('Network Error');
    expect(axiosErrorDetails(error)).toBe('Network Error');
  });

  it('should append string response data to the message', () => {
    const error = createAxiosError('Request failed', 'Service Unavailable');
    expect(axiosErrorDetails(error)).toBe('Request failed, Service Unavailable');
  });

  it('should append data.message when present', () => {
    const error = createAxiosError('Request failed', { message: 'Detailed error info', error: '' });
    expect(axiosErrorDetails(error)).toBe('Request failed, Detailed error info');
  });

  it('should append data.error when data.message is absent', () => {
    const error = createAxiosError('Request failed', { error: 'Not Found', message: '' });
    expect(axiosErrorDetails(error)).toBe('Request failed, Not Found');
  });

  it('should JSON-stringify data when it has neither message nor error', () => {
    const error = createAxiosError('Request failed', { code: 42, detail: 'unknown' });
    expect(axiosErrorDetails(error)).toBe('Request failed, {"code":42,"detail":"unknown"}');
  });

  it('should append context key-value pairs to the message', () => {
    const error = createAxiosError('Request failed', 'Bad Request');
    const result = axiosErrorDetails(error, { caseId: '123', userId: '456' });
    expect(result).toBe('Request failed, Bad Request [caseId=123 | userId=456]');
  });

  it('should filter out undefined values from context', () => {
    const error = createAxiosError('Request failed', 'Bad Request');
    const result = axiosErrorDetails(error, { caseId: '123', userId: undefined });
    expect(result).toBe('Request failed, Bad Request [caseId=123]');
  });

  it('should not append context brackets when all context values are undefined', () => {
    const error = createAxiosError('Request failed', 'Bad Request');
    const result = axiosErrorDetails(error, { caseId: undefined, userId: undefined });
    expect(result).toBe('Request failed, Bad Request');
  });

  it('should not append context when context is not provided', () => {
    const error = createAxiosError('Request failed', 'Bad Request');
    expect(axiosErrorDetails(error)).toBe('Request failed, Bad Request');
  });

  it('should handle null response data without appending anything', () => {
    const error = createAxiosError('Request failed', null);
    expect(axiosErrorDetails(error)).toBe('Request failed');
  });
});

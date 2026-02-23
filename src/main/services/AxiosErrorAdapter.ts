import { AxiosError } from 'axios';

import { getLogger } from '../logger';

const logger = getLogger('axiosErrorDetails');

// Get details from an axios error
export const axiosErrorDetails = (
  axiosError: AxiosError<{ error: string; message: string; trace: string }>,
  context?: { action?: string; caseId?: string; [key: string]: any }
): string => {
  let errorMessage = axiosError.message;
  logger.info('AXIOS axiosError.response?.data: ' + axiosError.response?.data);
  const data = axiosError.response?.data;

  if (typeof data === 'string') {
    errorMessage += `, ${data}`;
  } else if (data) {
    const errorDetail = data.message || data.trace || data.error;
    if (errorDetail) {
      errorMessage += `, ${errorDetail}`;
    }
  }
  logger.info('Axios message BEFORE CONTEXT: ' + errorMessage);
  if (context) {
    const contextStr = Object.entries(context)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => `${k}=${v}`)
      .join(' | ');
    if (contextStr) {
      errorMessage += ` [${contextStr}]`;
    }
  }
  logger.info('Axios message AFTER CONTEXT: ' + errorMessage);
  return errorMessage;
};

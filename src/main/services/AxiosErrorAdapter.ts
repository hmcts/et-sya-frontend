import { AxiosError } from 'axios';

import { getLogger } from '../logger';

const logger = getLogger('axiosErrorDetails');

// Get details from an axios error
export const axiosErrorDetails = (
  axiosError: AxiosError<{ error: string; message: string; trace: string }>,
  context?: { action?: string; caseId?: string; [key: string]: any }
): string => {
  let errorMessage = axiosError.message;
  logger.info('Axios message: ' + errorMessage);
  if (axiosError.response?.data?.error) {
    const errorDetail: string = axiosError.response.data.message
      ? axiosError.response.data.message
      : axiosError.response.data.trace;
    errorMessage += `, ${errorDetail}`;
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

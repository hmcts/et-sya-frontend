import { AxiosError } from 'axios';

// Get details from an axios error
export const axiosErrorDetails = (
  axiosError: AxiosError<{ error: string; message: string; trace: string }>,
  context?: { action?: string; caseId?: string; [key: string]: any }
): string => {
  let errorMessage = axiosError.message;
  if (axiosError.response?.data?.error) {
    const errorDetail: string = axiosError.response.data.message
      ? axiosError.response.data.message
      : axiosError.response.data.trace;
    errorMessage += `, ${errorDetail}`;
  }
  if (context) {
    const contextStr = Object.entries(context)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => `${k}=${v}`)
      .join(' | ');
    if (contextStr) {
      errorMessage += ` [${contextStr}]`;
    }
  }
  return errorMessage;
};

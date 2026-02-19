import { AxiosError } from 'axios';

// Get details from an axios error
export const axiosErrorDetails = (
  axiosError: AxiosError<{ error: string; message: string }>,
  context?: { action?: string; caseId?: string; [key: string]: any }
): string => {
  let errorMessage = axiosError.message;
  if (axiosError.response?.data?.error) {
    errorMessage += `, ${axiosError.response.data.error}`;
  }
  if (axiosError.response?.data?.message) {
    errorMessage += `, ${axiosError.response.data.message}`;
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

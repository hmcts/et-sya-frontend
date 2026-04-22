import { AxiosError } from 'axios';

// Extract details from an Axios error
export const axiosErrorDetails = (
  axiosError: AxiosError<{ error: string; message: string }>,
  context?: Record<string, any>
): string => {
  let errorMessage = axiosError.message;
  const data = axiosError.response?.data;

  if (typeof data === 'string') {
    errorMessage += `, ${data}`;
  } else if (data?.message || data?.error) {
    errorMessage += `, ${data.message || data.error}`;
  } else if (data) {
    errorMessage += `, ${JSON.stringify(data)}`;
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

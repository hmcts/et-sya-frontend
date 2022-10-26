import { AxiosError } from 'axios';

// Get details from an axios error
export const axiosErrorDetails = (axiosError: AxiosError<{ error: string; path: string }>): string => {
  let errorMessage = axiosError.message;
  if (axiosError.response) {
    const { error, path } = axiosError.response.data;
    errorMessage += `, error: ${error}, path: ${path}`;
  }
  return errorMessage;
};

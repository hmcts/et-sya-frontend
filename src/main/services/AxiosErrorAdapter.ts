import { AxiosError } from 'axios';

// Get details from an axios error
export const axiosErrorDetails = (axiosError: AxiosError<{ error: string; path: string }>): string => {
  let errorMessage = axiosError.message;
  if (axiosError.response) {
    errorMessage += `, ${axiosError.response.data?.error}`;
  }
  return errorMessage;
};

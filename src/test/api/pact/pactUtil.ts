import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function idamGetUserDetails(taskUrl: string) {
  const axiosConfig = {
    headers: {
      Authorization: 'Bearer some-access-token',
      'Content-Type': 'application/json',
    },
  };

  const response = await axios.get(taskUrl, axiosConfig);
  return response;
}

import axios from 'axios';
import config from 'config';
import jwtDecode from 'jwt-decode';

import { UserDetails } from '../definitions/appRequest';
import { CITIZEN_ROLE } from '../definitions/constants';
import { axiosErrorDetails } from '../services/AxiosErrorAdapter';

export const getRedirectUrl = (
  serviceUrl: string,
  callbackUrlPage: string,
  guid: string,
  languageParam: string
): string => {
  const clientID: string = process.env.IDAM_CLIENT_ID ?? config.get('services.idam.clientID');
  const loginUrl: string = process.env.IDAM_WEB_URL ?? config.get('services.idam.authorizationURL');
  const callbackUrl = encodeURI(serviceUrl + callbackUrlPage);
  return `${loginUrl}?client_id=${clientID}&response_type=code&redirect_uri=${callbackUrl}&state=${guid}&ui_locales=${languageParam}`;
};

export const getUserDetails = async (
  serviceUrl: string,
  rawCode: string,
  callbackUrlPageLink: string
): Promise<UserDetails> => {
  const id: string = process.env.IDAM_CLIENT_ID ?? config.get('services.idam.clientID');
  const secret: string = config.get('services.idam.clientSecret');
  const tokenUrl: string = process.env.IDAM_API_URL ?? config.get('services.idam.tokenURL');
  const callbackUrl = encodeURI(serviceUrl + callbackUrlPageLink);
  const code = encodeURIComponent(rawCode);
  const data = `client_id=${id}&client_secret=${secret}&grant_type=authorization_code&redirect_uri=${callbackUrl}&code=${code}`;

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  try {
    const response = await axios.post(tokenUrl, data, { headers });
    const jwt = jwtDecode(response.data.id_token) as IdTokenJwtPayload;

    return {
      accessToken: response.data.access_token,
      id: jwt.uid,
      email: jwt.sub,
      givenName: jwt.given_name,
      familyName: jwt.family_name,
      isCitizen: jwt.roles ? jwt.roles.includes(CITIZEN_ROLE) : false,
    };
  } catch (error) {
    throw new Error('Error getting user details from IDAM: ' + axiosErrorDetails(error));
  }
};

export interface IdTokenJwtPayload {
  uid: string;
  sub: string;
  given_name: string;
  family_name: string;
  roles: string[];
}

export interface IdamResponseData {
  access_token: string;
  refresh_token: string;
  scope: string;
  id_token: string;
  token_type: string;
  expires_in: number;
}

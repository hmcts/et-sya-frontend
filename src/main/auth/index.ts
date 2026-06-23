import axios from 'axios';
import config from 'config';
import jwtDecode from 'jwt-decode';

import { UserDetails } from '../definitions/appRequest';
import { CITIZEN_ROLE } from '../definitions/constants';

export const getRedirectUrl = (
  serviceUrl: string,
  callbackUrlPage: string,
  guid: string,
  languageParam: string
): string => {
  const clientID: string = process.env.IDAM_CLIENT_ID ?? config.get('services.idam.clientID');
  const hmctsAccess: boolean = (process.env.HMCTS_ACCESS ?? String(config.get('services.idam.hmctsAccess'))) === 'true';
  const loginUrl: string = hmctsAccess
    ? process.env.IDAM_WEB_URL_HMCTS_ACCESS ?? config.get('services.idam.hmctsAccessURL')
    : process.env.IDAM_WEB_URL ?? config.get('services.idam.authorizationURL');
  const callbackUrl = encodeURI(serviceUrl + callbackUrlPage);
  return `${loginUrl}?client_id=${clientID}&response_type=code&redirect_uri=${callbackUrl}&state=${guid}&ui_locales=${languageParam}&scope=${encodeURIComponent(
    'openid profile roles'
  )}`;
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

  const response = await axios.post(tokenUrl, data, { headers });
  const jwt = jwtDecode(response.data.id_token) as IdTokenJwtPayload;
  const accessToken = response.data.access_token;

  let roles = jwt.roles;
  let uid = jwt.uid;
  let givenName = jwt.given_name;
  let familyName = jwt.family_name;

  // Local IdAM simulators (e.g. RSE/CFTLIB) often omit roles from the id_token but expose them via /o/userinfo.
  if (!roles || !uid || !givenName || !familyName) {
    const userInfo = await fetchUserInfo(tokenUrl, accessToken);
    roles = roles ?? userInfo.roles;
    uid = uid ?? userInfo.uid;
    givenName = givenName ?? userInfo.given_name;
    familyName = familyName ?? userInfo.family_name;
  }

  return {
    accessToken,
    id: uid,
    email: jwt.sub,
    givenName,
    familyName,
    isCitizen: roles ? roles.includes(CITIZEN_ROLE) : false,
  };
};

const getUserInfoUrl = (tokenUrl: string): string => tokenUrl.replace(/\/token\/?$/, '/userinfo');

const fetchUserInfo = async (tokenUrl: string, accessToken: string): Promise<IdamUserInfo> => {
  const response = await axios.get(getUserInfoUrl(tokenUrl), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

export interface IdTokenJwtPayload {
  uid: string;
  sub: string;
  given_name: string;
  family_name: string;
  roles: string[];
}

export interface IdamUserInfo {
  uid: string;
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

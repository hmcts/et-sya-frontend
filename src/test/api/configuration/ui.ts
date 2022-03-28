import { healthEndpoints } from './health';
import {
  COOKIES_USERID,
  COOKIE_ROLES,
  COOKIE_TOKEN,
  IDAM_CLIENT,
  INDEX_URL,
  LAUNCH_DARKLY_CLIENT_ID,
  LOGGING,
  MAX_LINES,
  MAX_LOG_LINE,
  MICROSERVICE,
  NOW,
  OAUTH_CALLBACK_URL,
  PROTOCOL,
  SERVICES_IDAM_API_PATH,
  SERVICES_IDAM_WEB,
  SESSION_SECRET,
} from './references';
import { UIConfig, UIConfigCookies, UIConfigExceptionOptions, UIConfigServices } from './ui.config';

import { getConfigValue, getEnvironment } from './index';

export const uiConfig = (): UIConfig => {
  const configEnv = getEnvironment();

  return {
    iss: '',
    oidcEnabled: false,
    secureCookie: false,
    configEnv,
    cookies: {
      roles: getConfigValue(COOKIE_ROLES),
      token: getConfigValue(COOKIE_TOKEN),
      userId: getConfigValue(COOKIES_USERID),
    } as UIConfigCookies,
    exceptionOptions: {
      maxLines: getConfigValue(MAX_LINES),
    } as UIConfigExceptionOptions,
    health: healthEndpoints() as UIConfigServices,
    idamClient: getConfigValue(IDAM_CLIENT),
    indexUrl: getConfigValue(INDEX_URL),
    logging: getConfigValue(LOGGING),
    maxLogLine: getConfigValue(MAX_LOG_LINE),
    microservice: getConfigValue(MICROSERVICE),
    now: getConfigValue(NOW),
    oauthCallbackUrl: getConfigValue(OAUTH_CALLBACK_URL),
    protocol: getConfigValue(PROTOCOL),
    services: {
      idamApi: getConfigValue(SERVICES_IDAM_API_PATH),
      idamWeb: getConfigValue(SERVICES_IDAM_WEB),
    } as UIConfigServices,
    sessionSecret: getConfigValue(SESSION_SECRET),
    launchDarklyClientId: getConfigValue(LAUNCH_DARKLY_CLIENT_ID),
  };
};

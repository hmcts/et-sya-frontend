export interface UIConfig {
  configEnv: string;
  cookies: UIConfigCookies;
  exceptionOptions: UIConfigExceptionOptions;
  health: UIConfigServices;
  idamClient: unknown;
  indexUrl: unknown;
  logging: unknown;
  now: unknown;
  maxLogLine: unknown;
  microservice: unknown;
  oauthCallbackUrl: unknown;
  protocol: unknown;
  secureCookie: boolean;
  services: UIConfigServices;
  sessionSecret: unknown;
  oidcEnabled: boolean;
  iss: string;
  launchDarklyClientId: unknown;
}

export interface UIConfigCookies {
  token: string;
  userId: string;
  roles: string;
}
export interface UIConfigExceptionOptions {
  maxLines: number;
}

export interface UIConfigServices {
  idamApi: string;
  idamWeb: string;
}

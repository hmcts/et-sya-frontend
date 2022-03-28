/**
 * References to the configuration properties and their values contained with
 * the /config .yaml files.
 *
 * We store reference on how to extract the value from the .yaml data structure here.
 *
 * They are reference strings and therefore need to be testable.
 *
 * This file should be representative of the .yaml files in /config, and not
 * contain any additional constants. They are grouped as a representation of the .yaml structure.
 */
export const ENVIRONMENT = 'environment';

export const COOKIE_TOKEN = 'cookies.token';
export const COOKIES_USERID = 'cookies.userId';
export const COOKIE_ROLES = 'cookies.roles';

export const MAX_LINES = 'exceptionOptions.maxLines';

export const INDEX_URL = 'indexUrl';
export const MAX_LOG_LINE = 'maxLogLine';
export const IDAM_CLIENT = 'idamClient';
export const MICROSERVICE = 'microservice';
export const NOW = 'now';
export const OAUTH_CALLBACK_URL = 'oauthCallbackUrl';
export const PROTOCOL = 'protocol';

export const SERVICES_IDAM_API_PATH = 'services.idamApi';
export const SERVICES_IDAM_WEB = 'services.idamWeb';
export const SESSION_SECRET = 'sessionSecret';

export const LOGGING = 'logging';

export const IDAM_SECRET = 'secrets.rpx.ao-idam-client-secret';
export const APP_INSIGHTS_KEY = 'secrets.rpx.appinsights-instrumentationkey-ao';
export const LAUNCH_DARKLY_CLIENT_ID = 'secrets.rpx.launch-darkly-client-id';

export const USER_TIMEOUT_IN_SECONDS = 'userTimeoutInSeconds';

// PACT
export const PACT_BROKER_URL = 'pact.brokerUrl';
export const PACT_BRANCH_NAME = 'pact.branchName';
export const PACT_CONSUMER_VERSION = 'pact.consumerVersion';
export const PACT_BROKER_USERNAME = 'pact.brokerUsername';
export const PACT_BROKER_PASSWORD = 'pact.brokerPassword';

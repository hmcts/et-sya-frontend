import { SERVICES_IDAM_API_PATH, SERVICES_IDAM_WEB } from './references';
import { UIConfigServices } from './ui.config';

import { getConfigValue } from './index';

export const healthEndpoints = (): UIConfigServices => {
  const HEALTH = '/health';

  return {
    idamApi: getConfigValue(SERVICES_IDAM_API_PATH) + HEALTH,
    idamWeb: getConfigValue(SERVICES_IDAM_WEB) + HEALTH,
  };
};

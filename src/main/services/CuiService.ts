import https from 'https';

import { CUIClient, type CUIClientConfig, type CUIClientOptions } from '@hmcts/cui-client';
import config from 'config';

export { CUIActions, mergeCUIFlagItems } from '@hmcts/cui-client';
export type { CUIClient } from '@hmcts/cui-client';
export type {
  CUIClientConfig,
  CUIClientOptions,
  CUIStartJourneyAuth,
  CUIStartJourneyRequest,
  CUIStartJourneyResponse,
  CUIClientAuth,
  CUIFlag,
  CUIFlagDetails,
  CUIFlagItem,
  CUIFlagPath,
  CUIJourneyAction,
  CUIJourneyData,
} from '@hmcts/cui-client';

export const getCuiService = (loginUrl: string | null = null): CUIClient => {
  const cuiClientConfig = config.get<CUIClientConfig>('services.cui');
  const env = process.env.NODE_ENV || 'development';

  if (!cuiClientConfig) {
    throw new Error('Missing required configuration for CUI service');
  }

  const resolvedCuiClientConfig: CUIClientConfig = {
    ...cuiClientConfig,
    ...(loginUrl ? { logoutUrl: loginUrl } : {}),
  };

  if (env === 'development') {
    return new CUIClient(resolvedCuiClientConfig, {
      axiosConfig: {
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      },
    } as CUIClientOptions);
  }

  return new CUIClient(resolvedCuiClientConfig);
};

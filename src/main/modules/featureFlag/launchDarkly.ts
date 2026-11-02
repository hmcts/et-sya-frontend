import * as LaunchDarkly from '@launchdarkly/node-server-sdk';
import config from 'config';

import { getLogger } from '../../logger';

const logger = getLogger('launchDarkly');
const env = process.env.NODE_ENV || 'development';
const PLACEHOLDER_KEY = 'TO BE PICKED UP FROM ENV';

let ldClient: LaunchDarkly.LDClient;

const isPlaceholderKey = (ldKey: string): boolean =>
  !ldKey || ldKey === PLACEHOLDER_KEY || ldKey.includes('TO BE PICKED');

const createOfflineClient = async (): Promise<LaunchDarkly.LDClient> => {
  const client = LaunchDarkly.init('offline-sdk-key', { offline: true });
  await client.waitForInitialization({ timeout: 5 });
  logger.warn('Using LaunchDarkly offline mode; feature flags will use their default values.');
  return client;
};

async function getClient(): Promise<LaunchDarkly.LDClient> {
  const ldKey = config.get('services.launchDarkly.key') as string;

  if (env === 'development' && (isPlaceholderKey(ldKey) || process.env.LAUNCH_DARKLY_OFFLINE === 'true')) {
    return createOfflineClient();
  }

  const client = LaunchDarkly.init(ldKey);
  try {
    await client.waitForInitialization({ timeout: 5 });
    return client;
  } catch (error) {
    if (env === 'development') {
      logger.warn(`LaunchDarkly authentication failed (${(error as Error).message}). Falling back to offline mode.`);
      return createOfflineClient();
    }
    throw error;
  }
}

export async function getFlagValue(
  key: string,
  user: LaunchDarkly.LDUser | null,
  defaultValue = false
): Promise<LaunchDarkly.LDFlagValue> {
  if (!ldClient) {
    ldClient = await getClient();
  }
  if (!user) {
    user = {
      key: 'anonymous',
    };
  }
  const flagValue = await ldClient.variation(key, user, defaultValue);
  return flagValue;
}

import config from 'config';
import * as LaunchDarkly from 'launchdarkly-node-server-sdk';

let ldClient: LaunchDarkly.LDClient;

async function getClient(): Promise<LaunchDarkly.LDClient> {
  const ldKey = config.get('services.launchDarkly.key');
  const client = LaunchDarkly.init(ldKey as string);
  await client.waitForInitialization();
  return client;
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

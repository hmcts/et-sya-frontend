/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as path from 'path';

import pact from '@pact-foundation/pact';
import * as git from 'git-rev-sync';

import { getConfigValue } from '../../configuration';
import {
  PACT_BRANCH_NAME,
  PACT_BROKER_PASSWORD,
  PACT_BROKER_URL,
  PACT_BROKER_USERNAME,
  PACT_CONSUMER_VERSION,
} from '../../configuration/references';

const publish = async (): Promise<void> => {
  try {
    const pactBroker = getConfigValue(PACT_BROKER_URL) ? getConfigValue(PACT_BROKER_URL) : 'http://localhost:80';

    const pactTag = getConfigValue(PACT_BRANCH_NAME) ? getConfigValue(PACT_BRANCH_NAME) : 'Dev';

    const consumerVersion =
      getConfigValue(PACT_CONSUMER_VERSION) !== '' ? getConfigValue(PACT_CONSUMER_VERSION) : git.short();

    const certPath = path.resolve(__dirname, '../cer/ca-bundle.crt');
    process.env.SSL_CERT_FILE = certPath;

    const opts = {
      consumerVersion,
      pactBroker,
      pactBrokerPassword: getConfigValue(PACT_BROKER_PASSWORD),
      pactBrokerUsername: getConfigValue(PACT_BROKER_USERNAME),
      pactFilesOrDirs: [path.resolve(__dirname, '../pacts/')],
      tags: [pactTag],
    };
    // @ts-ignore
    await pact.publishPacts(opts);

    console.log('Pact contract publishing complete!');
    console.log('');
    console.log(`Head over to ${pactBroker}`);
    console.log('to see your published contracts.');
  } catch (e) {
    console.log('Pact contract publishing failed: ', e);
  }
};

(async () => {
  await publish();
})();

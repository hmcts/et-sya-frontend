import * as fs from 'fs';
import * as path from 'path';

import axios from 'axios';
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

    const pactTag: string = getConfigValue(PACT_BRANCH_NAME) ? String(getConfigValue(PACT_BRANCH_NAME)) : 'Dev';

    const consumerVersion: string =
      getConfigValue(PACT_CONSUMER_VERSION) !== '' ? String(getConfigValue(PACT_CONSUMER_VERSION)) : git.short();

    const certPath = path.resolve(__dirname, '../cer/ca-bundle.crt');
    process.env.SSL_CERT_FILE = certPath;

    const pactDir = path.resolve(process.cwd(), 'pact/pacts');

    if (!fs.existsSync(pactDir)) {
      console.log(`Pact directory not found: ${pactDir}. No pacts to publish.`);
      return;
    }

    const pactFiles = fs.readdirSync(pactDir).filter(f => f.endsWith('.json'));

    if (pactFiles.length === 0) {
      console.log('No pact files found to publish.');
      return;
    }

    const username = String(getConfigValue(PACT_BROKER_USERNAME));
    const password = String(getConfigValue(PACT_BROKER_PASSWORD));
    const auth = username ? { username, password } : undefined;

    for (const file of pactFiles) {
      const pactJson = JSON.parse(fs.readFileSync(path.join(pactDir, file), 'utf8'));
      const consumer: string = pactJson.consumer.name;
      const provider: string = pactJson.provider.name;

      const publishUrl = `${pactBroker}/pacts/provider/${encodeURIComponent(provider)}/consumer/${encodeURIComponent(
        consumer
      )}/version/${encodeURIComponent(consumerVersion)}`;

      await axios.put(publishUrl, pactJson, {
        headers: { 'Content-Type': 'application/json' },
        auth,
      });

      console.log(`Published pact: ${consumer} -> ${provider} @ v${consumerVersion}`);

      const tagUrl = `${pactBroker}/pacticipants/${encodeURIComponent(consumer)}/versions/${encodeURIComponent(
        consumerVersion
      )}/tags/${encodeURIComponent(pactTag)}`;

      await axios.put(
        tagUrl,
        {},
        {
          headers: { 'Content-Type': 'application/json' },
          auth,
        }
      );

      console.log(`Tagged ${consumer} v${consumerVersion} as '${pactTag}'`);
    }

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

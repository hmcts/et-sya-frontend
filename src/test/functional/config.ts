import { Application } from 'express';

import { PropertiesVolume } from '../../main/modules/properties-volume';

if (!process.env.TEST_PASSWORD) {
  new PropertiesVolume().enableFor({ locals: { developmentMode: true } } as unknown as Application);
}

export const config = {
  TestUrl: process.env.TEST_URL || 'http://localhost:3001',
  TestHeadlessBrowser: true,
  TestSlowMo: 250,
  WaitForTimeout: 10000,
  Gherkin: {
    features: './features/**/*js',
    //steps: ['../functional/step_definitions/steps.ts'],
  },
  helpers: {},
};

config.helpers = {
  /*
  Playwright: {
    url: config.TestUrl,
    show: !config.TestHeadlessBrowser,
    browser: 'chromium',
    waitForTimeout: config.WaitForTimeout,
    waitForAction: 1000,
    waitForNavigation: 'networkidle0',
    ignoreHTTPSErrors: true,
  },*/
  Puppeteer: {
    url: config.TestUrl,
    waitForTimeout: config.WaitForTimeout,
    waitForAction: 1000,
    //getPageTimeout: 30000,
    show: !config.TestHeadlessBrowser,
    browser: 'chromium',
    waitForNavigation: 'networkidle0',
    ignoreHTTPSErrors: true,
    headless: false
    /*chrome: {
      ignoreHTTPSErrors: true,
      args: [
        '--no-sandbox',
        '--proxy-server=proxyout.reform.hmcts.net:8080'
      ]
    }*/

  }
};

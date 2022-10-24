const frontend = process.env.TEST_URL || 'http://localhost:3001';
const { I } = inject();
Feature('Health');
const { Logger } = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('app');

Scenario('The API is up, healthy and responding to requests to /health', () => {
  logger.info('Running Smoke Test');
  I.amOnPage(frontend + '/health');
  I.retry({
    minTimeout: 15000,
    maxTimeout: 15000,
  }).see('"status":"UP"');
  logger.info('After Smoke Test');
});

const frontend = process.env.TEST_URL || 'http://localhost:3001';
const { I } = inject();
Feature('Health');

Scenario('The API is up, healthy and responding to requests to /health', () => {
  I.amOnPage(frontend + '/health');
  console.log(process.env.TEST_URL);
  I.retry({
    minTimeout: 15000,
    maxTimeout: 15000,
  }).see('"status":"UP"');
});

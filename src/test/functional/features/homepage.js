Feature('ET Homepage');
const testConfig = require('../config.js');
const { I } = inject();
const waitSeconds = 5;
Scenario('ET homepage to create single claim', async () => {
  I.amOnPage(testConfig.testUrl);
  I.wait(waitSeconds);
});

Scenario('ET homepage to create single claim for myself', async () => {
  etpageFlow();
  I.wait(waitSeconds);
  I.checkOption('input[id=lip-or-representative]');
  I.click('Continue');
  I.wait(waitSeconds);
  I.checkOption('input[id=single-or-multiple-claim]');
  I.click('Continue');
});

Scenario('ET homepage to create single claim for someone else', async () => {
  etpageFlow();
  I.wait(waitSeconds);
  I.checkOption('input[id=lip-or-representative-2]');
  I.click('Continue');
});

Scenario('ET homepage to create multiple claims for myself', async () => {
  etpageFlow();
  I.wait(waitSeconds);
  I.checkOption('input[id=lip-or-representative]');
  I.click('Continue');
  I.wait(waitSeconds);
  I.checkOption('input[id=single-or-multiple-claim-2]');
  I.click('Continue');
});

Scenario('ET homepage to create multiple claims for someone else', async () => {
  etpageFlow();
  I.wait(waitSeconds);
  I.checkOption('input[id=lip-or-representative-2]');
  I.click('Continue');
});

async function etpageFlow() {
  I.amOnPage(testConfig.testUrl);
  I.wait(waitSeconds);
  I.see('Make a claim to an employment tribunal');
  I.click('Start now');
  I.wait(waitSeconds);
  I.see('To make a claim you may want to prepare and have the following to hand');
  I.click('Continue');
}

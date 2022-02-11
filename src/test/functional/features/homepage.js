require('ts-node').register({ project: 'src/test/functional/tsconfig.json' });

var config = require('../config.ts');


Feature('Homepage');
//const testConfig = require('../config');
const { I } = inject();
console.log("----"+config.TestUrl);
Scenario('ET homepage to create single claim for myself', async () => {
  I.amOnPage("http://localhost:3001");
  I.see("Make a claim to an employment tribunal");
  I.click("Start now");
  I.see("To make a claim you may want to prepare and have the following to hand");
  I.wait(2);
  I.click("Continue");
  I.checkOption('input[id=lip-or-representative]');
  I.click("Continue");
  I.checkOption('input[id=single-or-multiple-claim]');
  I.click("Continue");
});

Scenario('ET homepage to create single claim for someone else', async () => {
  I.amOnPage("http://localhost:3001");
  I.see("Make a claim to an employment tribunal");
  I.click("Start now");
  I.see("To make a claim you may want to prepare and have the following to hand");
  I.wait(2);
  I.click("Continue");
  I.checkOption('input[id=lip-or-representative-2]');
  I.click("Continue");
  I.seeInCurrentUrl("https://employmenttribunals.service.gov.uk/en/apply/application-number");
});

Scenario('ET homepage to create multiple claims for myself', async () => {
  I.amOnPage("http://localhost:3001");
  I.see("Make a claim to an employment tribunal");
  I.click("Start now");
  I.see("To make a claim you may want to prepare and have the following to hand");
  I.wait(2);
  I.click("Continue");
  I.checkOption('input[id=lip-or-representative]');
  I.click("Continue");
  I.checkOption('input[id=single-or-multiple-claim-2]');
  I.click("Continue");
});

Scenario('ET homepage to create multiple claims for someone else', async () => {
  I.amOnPage("http://localhost:3001");
  I.see("Make a claim to an employment tribunal");
  I.click("Start now");
  I.see("To make a claim you may want to prepare and have the following to hand");
  I.wait(2);
  I.click("Continue");
  I.checkOption('input[id=lip-or-representative-2]');
  I.click("Continue");
  I.seeInCurrentUrl("https://employmenttribunals.service.gov.uk/en/apply/application-number");
});

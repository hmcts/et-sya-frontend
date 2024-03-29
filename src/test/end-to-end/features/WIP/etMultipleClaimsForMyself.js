Feature('ET multiple claims for my self');
const commonFlow = require('../../helpers/commonFlow');
const { I } = inject();
const waitSeconds = 2;

Scenario('Verify ET multiple claim for myself', async () => {
  await commonFlow.initialPageFlow();
  I.wait(3);
  I.waitForText('I’m representing myself and making my own claim', waitSeconds);
  I.click('Who can act as a representative?', 'span[class=govuk-details__summary-text]');
  I.see('Citizens Advice advisers');
  I.checkOption('input[id=lip-or-representative]');
  I.click('Continue');

  I.seeElement('#single-or-multiple-claim-2');
  I.see('Are you making a claim on your own or with others?');
  I.checkOption('input[id=single-or-multiple-claim-2]');
  I.click('Continue');
  I.seeInCurrentUrl('/application-number');
});

Feature('ET multiple claims for my self');
const commonFlow = require('./commonFlow.js');
const { I } = inject();
const waitSeconds = 2;

Scenario('Verify ET multiple claim for myself', async () => {
  commonFlow.initialPageFlow();

  I.waitForText('I’m representing myself and making my own claim', waitSeconds);
  I.click('Who can act as a representative?', 'span[class=govuk-details__summary-text]');
  I.see('Citizens Advice advisers');
  I.checkOption('input[id=lip-or-representative]');
  I.click('Continue');

  I.seeElement('#single-or-multiple-claim-2');
  I.see('Are you making a ‘single’ claim on your own or a ‘multiple’ claim alongside other people?');
  I.checkOption('input[id=single-or-multiple-claim-2]');
  I.click('Continue');
}).tag(' @RET-BAT');

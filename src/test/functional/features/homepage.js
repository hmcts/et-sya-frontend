Feature('ET Homepage');
const testConfig = require('../config.js');
const { I } = inject();
const waitSeconds = 5;

Scenario('ET homepage to create single claim for myself when there is no acas certificate', async () => {
  etpageFlow();

  I.waitForText('I’m representing myself and making my own claim', waitSeconds);
  I.click('Who can act as a representative?', 'span[class=govuk-details__summary-text]');
  I.see('employment advisors – including those from Citizens Advice');
  I.checkOption('input[id=lip-or-representative]');

  I.checkOption('input[id=lip-or-representative]');
  I.click('Continue');

  I.waitForText(
    'Are you making a ‘single’ claim on your own or a ‘multiple’ claim alongside other people?',
    waitSeconds
  );
  I.checkOption('input[id=single-or-multiple-claim]');
  I.click('Continue');

  I.waitForText("Are you making a claim against more than 1 'respondent'?", waitSeconds);
  I.see('Yes - I’m making a claim against more than 1 respondent');
  I.checkOption('input[id=more_than_one_respondent]');
  I.click('Continue');

  I.waitForText(
    "Do you have an ‘Acas early conciliation certificate’ for each respondent you're making a claim against?",
    waitSeconds
  );
  I.click('How can ‘early conciliation’ help?', 'span[class=govuk-details__summary-text]');
  I.see('Making a claim can be time-consuming and difficult for everyone involved.');
  I.see('No');
  I.checkOption('input[id=acas-multiple-2]');
  I.click('Continue');

  I.waitForText(
    'Do you have a valid reason why you do not have an ‘Acas early conciliation certificate’?',
    waitSeconds
  );
  I.see('No');
  I.checkOption('input[id=valid-no-acas-reason-2]');
  I.click('Continue');

  I.waitForText('You need to contact Acas', waitSeconds);
  I.click('Contact Acas');
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

Scenario('ET gender details page', async () => {
  I.amOnPage(testConfig.testUrl + '/gender-details');
  I.wait(waitSeconds);
  I.see('Sex and gender identity');
});

async function etpageFlow() {
  I.amOnPage(testConfig.testUrl);
  I.waitForText('Make a claim to an employment tribunal', waitSeconds);
  I.waitForText('Start now', waitSeconds);
  I.click('Start now');
  I.waitForText('To make a claim you may want to prepare and have the following to hand', waitSeconds);
  I.click('Continue');
}

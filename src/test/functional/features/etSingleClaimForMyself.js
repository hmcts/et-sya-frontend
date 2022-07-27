Feature('ET Single claim for my self');
const { I } = inject();
const authPage = require('./authPage.js');
const commonFlow = require('./commonFlow.js');

Scenario('Verify ET single claim for myself when there is no acas certificate', async () => {
  commonPages();

  I.see("Do you have an ‘Acas early conciliation certificate’ for each respondent you're making a claim against?");
  I.click('How can ‘early conciliation’ help?', 'span[class=govuk-details__summary-text]');
  I.see('Making a claim can be time-consuming and difficult for everyone involved.');
  I.see('No');
  I.checkOption('input[id=acas-multiple-2]');
  I.click('Continue');

  I.see('Do you have a valid reason why you do not have an ‘Acas early conciliation certificate’?');
  I.see('No');
  I.checkOption('input[id=valid-no-acas-reason-2]');
  I.click('Continue');

  I.see('You need to contact Acas');
  I.click('Contact Acas');
});

Scenario('Verify ET single claim myself when claim against one or more respondents', async () => {
  commonPages();

  I.seeElement('#acas-multiple-2');
  I.click('How can ‘early conciliation’ help?', 'span[class=govuk-details__summary-text]');
  I.checkOption('input[id=acas-multiple-2]');
  I.click('Continue');

  I.seeElement('#valid-no-acas-reason');
  I.checkOption('input[id=valid-no-acas-reason]');
  I.click('Continue');

  I.seeElement('#discrimination');
  I.checkOption('input[value=discrimination]');
  I.click('#main-form-submit');

  authPage.login();

  I.seeElement('(//a[@href="/steps-to-making-your-claim"])');
  I.see('You do not have to complete your claim in one go');
  I.click('Continue');

  I.seeElement('(//a[@href="/how-would-you-like-to-be-contacted-about-your-claim"])');
  I.click('(//a[@href="/how-would-you-like-to-be-contacted-about-your-claim"])');

  I.seeElement('#contact-preference');
  I.checkOption('#contact-preference');
  I.click('#main-form-submit');

  I.seeElement('#hearingPreference');
  I.checkOption('#hearingPreference');
  I.click('#main-form-submit');

  I.seeElement('#reasonableAdjustments');
  I.checkOption('#reasonableAdjustments');
  I.seeElement('#adjustmentDetailText');
  I.fillField('#adjustmentDetailText', 'disability details');
  I.click('#main-form-submit');

  I.seeElement('#tasklist-check');
  I.checkOption('#tasklist-check');
  I.click('#main-form-submit');

  authPage.logout();
});

function commonPages() {
  commonFlow.initialPageFlow();

  I.seeElement('#lip-or-representative');
  I.see('I’m representing myself and making my own claim');
  I.click('Who can act as a representative?', 'span[class=govuk-details__summary-text]');
  I.see('employment advisors – including those from Citizens Advice');
  I.checkOption('input[id=lip-or-representative]');
  I.click('Continue');

  I.seeElement('#single-or-multiple-claim');
  I.see('Are you making a ‘single’ claim on your own or a ‘multiple’ claim alongside other people?');
  I.checkOption('input[id=single-or-multiple-claim]');
  I.click('Continue');
}

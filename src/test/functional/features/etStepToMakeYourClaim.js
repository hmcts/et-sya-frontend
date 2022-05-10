Feature('Claim Details');
const test_url = '/steps-to-making-your-claim';
const { I } = inject();
const discriminationClaim = '//*[@id="main-content"]/div/div/details[1]/summary/span';
const whatToWrite_dismissal = '//*[@id="main-content"]/div/div/details[2]/summary/span';
const whatToWrite_whitsleblower = '//*[@id="main-content"]/div/div/details[3]/summary/span';
const whatToWrite_otherClaim = '//*[@id="main-content"]/div/div/details[4]/summary/span';
const document_upload = '//*[@id="main-form"]/details/summary/span';
const compensation_award = locate('.govuk-details__summary-text').withText('Compensation - what can a tribunal award?');
const tribunal_recommendation = locate('.govuk-details__summary-text').withText('What is a tribunal recommendation?');

Scenario('Claim Details: Summarise what happened to you', () => {
  I.amOnPage(test_url);
  I.see('3. Claim details');
  I.seeElement('[href="/summarise-what-happened"]');
  I.click('[href="/summarise-what-happened"]');
  I.see('Summarise what happened to you (optional) (to do)');
  I.see('What to include in your claim');
  I.seeElement(discriminationClaim);
  I.click(discriminationClaim);
  I.see('Describe the events you are complaining about.');
  I.click(whatToWrite_dismissal);
  I.see('Describe the circumstances of your dismissal.');
  I.click(whatToWrite_whitsleblower);
  I.see("Describe how you've been affected by the detrimental treatment.");
  I.click(whatToWrite_otherClaim);
  I.see(
    'The tribunal can only hear cases where legislation gives it power to do so. Explain briefly, if you can, what legislation you say covers this claim.'
  );
  I.seeElement('#main-form');
  I.fillField('#claim-summary-text', 'Employment Tribunal Functional Test');
  I.click(document_upload);
  I.seeElement('#claim-summary-file');

  // file upload
  I.attachFile('input[name="claimSummaryFile"]', 'features/Data/test_doc.pdf');
  I.click('#main-form-submit');
  I.see('Tell us what you want from your claim? (optional) (to do)');
}).tag('@RET-1235');

Scenario('Claim Details: Tell us what you want from your claim - Save as draft', () => {
  I.amOnPage(test_url);
  I.see('3. Claim details');
  I.seeElement('[href="/what-you-want-from-your-claim"]');
  I.click('[href="/what-you-want-from-your-claim"]');
  I.see('Tell us what you want from your claim? (optional) (to do)');
  I.click(compensation_award);
  I.see(
    'If a tribunal decides you’ve been unfairly dismissed, you’ll normally receive compensation which is made up of:'
  );
  I.click(tribunal_recommendation);
  I.checkOption(locate('#claimOutcome').first());
  I.checkOption(locate('#claimOutcome').last());
  I.click('#main-form-save-for-later');
  I.see('Your claim has been saved');
}).tag('@RET-1235');

Scenario('Claim Details: Tell us what you want from your claim - Save and continue', () => {
  I.amOnPage(test_url);
  I.see('3. Claim details');
  I.seeElement('[href="/what-you-want-from-your-claim"]');
  I.click('[href="/what-you-want-from-your-claim"]');
  I.see('Tell us what you want from your claim? (optional) (to do)');
  I.click(compensation_award);
  I.see(
    'If a tribunal decides you’ve been unfairly dismissed, you’ll normally receive compensation which is made up of:'
  );
  I.click(tribunal_recommendation);
  I.checkOption(locate('#claimOutcome').first());
  I.checkOption(locate('#claimOutcome').last());
  I.click('#main-form-submit');
  I.see('What compensation are you seeking?');
  I.fillField('#compensation-outcome', 'Employment Tribunal Test');
  I.fillField('#compensation-amount', '5000000');
  I.click('#main-form-submit');
  // returned to start page at the moment
  I.see('Steps to making your claim TODO');
}).tag('@RET-1235');

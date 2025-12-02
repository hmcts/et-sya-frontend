'use strict';
const contactUs = require('../../helpers/contactUsForCitizenHub');

module.exports = async function () {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const I = this;
  I.see('Case overview -');
  I.see('Case number');
  I.see('You have submitted your claim to the tribunal');
  I.see('We aim to process your claim by');
  I.see('In busy periods it may take longer.');
  I.see('Your claim');
  I.see('Your ET1 claim form');
  I.see('The response');
  I.see('Response from the respondent (ET3)');
  I.see('View details of your hearings');
  I.see('Applications to the tribunal');
  I.see('Your request and applications');
  I.see("Respondent's applications");
  I.see('Contact the tribunal about your case');
  I.see('Notifications from the tribunal');
  I.see('All notifications from the tribunal');
  I.see('Judgments from the tribunal');
  I.see('View all judgments');
  I.see('Case documents');
  I.see('All documents');

  I.see('I want to');
  I.see('Contact the tribunal about my case');
  I.see('Find legal advice (opens in new tab)');
  I.click("//span[@class='govuk-details__summary-text']");
  I.wait(1);

  // The case at this point is does not have a legal rep with myHMCTS account hence the new behaviour
  // introduced in RET-3549 the old behaviour is now part of e2e
  // it will only get triggered once the case a leg rep registered on myHMCTS
  I.click('[href="/holding-page"]');
  I.waitForElement('#main-content', 20);
  I.see('This function is not currently available for this case, please return to the main page');
  contactUs.verifyContactUs();
  I.click('//a[contains(.,"Close and return to case overview")]');
  I.waitForElement('#main-content', 20);
  I.see('You have submitted your claim to the tribunal');
};

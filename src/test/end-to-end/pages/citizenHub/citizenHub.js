'use strict';

module.exports = async function () {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const I = this;
  I.see('Case overview -');
  I.see('Case number');
  I.see('You have submitted your claim to the tribunal');
  I.see('We aim to process your claim by');
  I.see('In busy periods it may take longer.');
  I.see('About you');
  I.see('View and edit your personal details');
  I.see('Your claim');
  I.see('Your ET1 claim form');
  I.see('The response');
  I.see('Response from the respondent (ET3)');
  I.see('View details of your hearings');
  I.see('Applications to the tribunal');
  I.see('Your request and applications');
  I.see("Respondent's applications");
  I.see('Contact the tribunal about your case');
  I.see('Orders and requests from the tribunal');
  I.see('All orders and requests issued by the tribunal');
  I.see('Judgments from the tribunal');
  I.see('View all judgements');
  I.see('Case documents');
  I.see('All documents');

  I.see('I want to');
  I.see('Contact the tribunal about my case');
  I.see('Find legal advice (opens in new tab)');
  I.see('Contact');
  I.click('Contact the tribunal about my case');
};

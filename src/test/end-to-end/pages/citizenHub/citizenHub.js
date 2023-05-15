const contactUs = require('../../helpers/contactUsForCitizenHub');
('use strict');

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
  I.see('Orders and requests from the tribunal');
  I.see('All orders and requests issued by the tribunal');
  I.see('Judgments from the tribunal');
  I.see('View all judgments');
  I.see('Case documents');
  I.see('All documents');

  I.see('I want to');
  I.see('Contact the tribunal about my case');
  I.see('Find legal advice (opens in new tab)');
  I.click("//span[@class='govuk-details__summary-text']");
  I.wait(1);
  I.click("//a[contains(.,'Contact the tribunal about my case')]");

  I.waitForText('Contact the tribunal about your case', 30);
  I.see('Use the appropriate form to communicate with the tribunal.');
  I.see(
    'These requests and applications will be reviewed by the tribunal and copied to the respondent who will have an opportunity to respond.'
  );
  I.see('You may be able to request that some details do not get shared with the respondent.');

  I.see('Give notice that I want to withdraw all or part of my claim');
  I.see('I want to change my personal details');
  I.see('Apply to postpone my hearing');
  I.see('Apply to vary or revoke an order');
  I.see('Apply to have a decision considered afresh');
  I.see('Apply to amend my claim');
  I.see('Order a witness to attend to give evidence');
  I.see('Tell the tribunal the respondent has not complied with an order');
  I.see('Apply to restrict publicity');
  I.see('Strike out all or part of the response');
  I.see('Apply for a judgment to be reconsidered');
  I.see('Contact the tribunal about something else');

  I.click("//div[@id='contact-options']/div[2]//span[@class='govuk-accordion__section-toggle-text']");
  I.see("When you've reached a settlement or do not want to continue with your claim.");
  I.see('Give notice that I want to withdraw all or part of my claim');
  I.click("//div[@id='contact-options']/div[2]//span[@class='govuk-accordion__section-toggle-text']");

  I.click("//div[@id='contact-options']/div[3]//span[@class='govuk-accordion__section-toggle-text']");
  I.see('Change the personal details you gave when making your claim.');
  I.see('I want to change my personal details');
  I.click("//div[@id='contact-options']/div[3]//span[@class='govuk-accordion__section-toggle-text']");

  I.click("//div[5]//span[@class='govuk-accordion__section-toggle-text']");
  I.see(
    'Apply to vary or revoke an order the tribunal has issued. For example, you may need more time to submit something or want to change the number of pages in your hearing documents,'
  );
  I.see('Apply to vary or revoke an order');
  I.click("//div[5]//span[@class='govuk-accordion__section-toggle-text']");

  I.click("//div[6]//span[@class='govuk-accordion__section-toggle-text']");
  I.see(
    'If you disagree with a judgement or order made by a legal officer in your case you can ask an employment judge to look at that decision again.'
  );
  I.see('Apply to have a decision considered afresh');
  I.click("//div[6]//span[@class='govuk-accordion__section-toggle-text']");

  I.click("//div[7]//span[@class='govuk-accordion__section-toggle-text']");
  I.see('Request to amend your ET1 claim - including adding or removing claims or details of your claim.');
  I.see('Apply to amend my claim');
  I.click("//div[7]//span[@class='govuk-accordion__section-toggle-text']");

  I.click("//div[8]//span[@class='govuk-accordion__section-toggle-text']");
  I.see('Apply to order the respondent to do or provide something.');
  I.see('Order the respondent to do something');
  I.click("//div[8]//span[@class='govuk-accordion__section-toggle-text']");

  I.click("//div[9]//span[@class='govuk-accordion__section-toggle-text']");
  I.see('Apply to order a witness to attend to give evidence in your case.');
  I.see('Order a witness to attend to give evidence');
  I.click("//div[9]//span[@class='govuk-accordion__section-toggle-text']");

  I.click("//div[10]//span[@class='govuk-accordion__section-toggle-text']");
  I.see('Tell us that the respondent has not complied with all or part of an order from the tribunal.');
  I.see('Tell the tribunal the respondent has not complied with an order');
  I.click("//div[10]//span[@class='govuk-accordion__section-toggle-text']");

  I.click("//div[11]//span[@class='govuk-accordion__section-toggle-text']");
  I.see(
    'Apply to prevent or restrict publicity in your case. The tribunal may conduct hearings in private or anonymise specific parties and witnesses if necessary.'
  );
  I.see('Apply to restrict publicity');
  I.click("//div[11]//span[@class='govuk-accordion__section-toggle-text']");

  I.click("//div[12]//span[@class='govuk-accordion__section-toggle-text']");
  I.see("You can request that the tribunal strike out all or parts of the respondent's response.");
  I.see('Strike out all or part of the response');
  I.click("//div[12]//span[@class='govuk-accordion__section-toggle-text']");

  I.click("//div[13]//span[@class='govuk-accordion__section-toggle-text']");
  I.see('Ask to have a judgement made by a judge reconsidered.');
  I.see('Apply for a judgment to be reconsidered');
  I.click("//div[13]//span[@class='govuk-accordion__section-toggle-text']");

  I.click("//div[14]//span[@class='govuk-accordion__section-toggle-text']");
  I.see(
    'Tell or ask the tribunal about something relevant to your case, and which is not covered by the other options on this page.'
  );
  I.see('Contact the tribunal about something else');
  I.click("//div[14]//span[@class='govuk-accordion__section-toggle-text']");

  I.click("//span[@class='govuk-accordion__show-all-text']");
  I.see("When you've reached a settlement or do not want to continue with your claim.");
  I.see('Give notice that I want to withdraw all or part of my claim');

  I.see('Change the personal details you gave when making your claim.');
  I.see('I want to change my personal details');

  I.see(
    'Apply to vary or revoke an order the tribunal has issued. For example, you may need more time to submit something or want to change the number of pages in your hearing documents,'
  );
  I.see('Apply to vary or revoke an order');

  I.see(
    'If you disagree with a judgement or order made by a legal officer in your case you can ask an employment judge to look at that decision again.'
  );
  I.see('Apply to have a decision considered afresh');

  I.see('Request to amend your ET1 claim - including adding or removing claims or details of your claim.');
  I.see('Apply to amend my claim');

  I.see('Apply to order the respondent to do or provide something.');
  I.see('Order the respondent to do something');

  I.see('Apply to order a witness to attend to give evidence in your case.');
  I.see('Order a witness to attend to give evidence');

  I.see('Tell us that the respondent has not complied with all or part of an order from the tribunal.');
  I.see('Tell the tribunal the respondent has not complied with an order');

  I.see(
    'Apply to prevent or restrict publicity in your case. The tribunal may conduct hearings in private or anonymise specific parties and witnesses if necessary.'
  );
  I.see('Apply to restrict publicity');

  I.see("You can request that the tribunal strike out all or parts of the respondent's response.");
  I.see('Strike out all or part of the response');

  I.see('Ask to have a judgement made by a judge reconsidered.');
  I.see('Apply for a judgment to be reconsidered');

  I.see(
    'Tell or ask the tribunal about something relevant to your case, and which is not covered by the other options on this page.'
  );
  I.see('Contact the tribunal about something else');
  I.click("//span[@class='govuk-accordion__show-all-text']");
  contactUs.verifyContactUs();
};

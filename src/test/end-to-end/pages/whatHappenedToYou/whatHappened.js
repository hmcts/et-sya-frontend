'use strict';
const contactUs = require('../../helpers/contactUs.js');

const whatHappenedToYouConfig = require('./whatHappenedToYou.json');

module.exports = async function () {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const I = this;
  I.see('Describe what happened to you');
  I.see('This is your opportunity to explain why you are making a claim to an employment tribunal.');
  I.see(
    'It’s important you focus on setting out what happened to you and explain, as far as you can, why you think what'
  );
  I.see('happened was unlawful.');
  I.see('Your claim will be sent to the respondents who will have a chance to reply through the tribunal.');
  I.see('The tribunal will then decide (usually via a hearing) whether the respondents have acted unlawfully.');
  I.see(
    'We do not need detailed evidence, such as copies of emails, letters or other documents at this stage. Keep hold'
  );
  I.see('of these documents in case they are needed. You may need to bring them to a hearing.');
  I.see('What to write for discrimination claims');
  I.see('What to write for dismissal claims');
  I.see('What to write for whistleblower claims');
  I.see("What to write for 'other' claims");
  I.see('Use this box to describe the events around your dispute, or add to your claim by uploading a document');
  I.see('You have 2500 characters remaining');
  I.see('Or upload your summary as a separate document (optional)');

  I.click(whatHappenedToYouConfig.what_to_write_for_discrimination_claims);
  I.wait(1);
  I.see('Describe the events you are complaining about.');
  I.see('Try to give the dates of the events (and set them out in date order) and the');
  I.see('names of other people involved. Explain, as best you can, why you consider');
  I.see('that these events mean that you have been unlawfully discriminated');
  I.see('against, by reference to the protected characteristics you rely on.');

  I.click(whatHappenedToYouConfig.what_to_write_for_dismissal_claims);
  I.wait(1);
  I.see('Describe the circumstances of your dismissal.');
  I.see('Try to give the dates of the events (like dismissal meetings) and the names');
  I.see('of others involved (such as the person who dismissed you). You should ex');
  I.see('plain, as best you can, why you consider that your dismissal was unfair.');

  I.click(whatHappenedToYouConfig.what_to_write_for_whistle_blower_claims);
  I.wait(1);
  I.see('Give the dates of each time you say you "blew the whistle" by making a');
  I.see('protected disclosure. For each disclosure summarise the information you');
  I.see('disclosed, whether it was done verbally or in writing, the person to whom');
  I.see('you made the disclosure, what kind of wrongdoing you were disclosing,');
  I.see('and why the disclosure was in the public interest.');
  I.see('Explain how you were treated detrimentally (which can include being dis');
  I.see('missed) because of the disclosure(s), giving dates and summarising the');
  I.see('incidents.');
  I.see('Describe how you’ve been affected by the detrimental treatment.');

  I.click(whatHappenedToYouConfig.what_to_write_for_other_claims);
  I.wait(1);
  I.see('The tribunal can only hear cases where legislation gives it power to do so.');
  I.see('Explain briefly, if you can, what legislation you say covers this claim.');
  I.see('Even if you cannot, the most important thing is to explain what was done');
  I.see('and, so far as you can, why you say it was unlawful. Give dates and brief');
  I.see('details of each incident, including the name of the person responsible.');

  I.click(whatHappenedToYouConfig.upload_your_summary_as_a_separate);
  I.wait(1);
  I.see('You can only upload 1 document.');
  I.see('Upload a file');

  I.fillField(whatHappenedToYouConfig.claim_summary_notes, 'Discrimination, Dismissal and Pay Cut.');

  I.click(whatHappenedToYouConfig.contact_us);
  I.wait(1);
  await contactUs.verifyContactUs();

  I.click('Save and continue');
};

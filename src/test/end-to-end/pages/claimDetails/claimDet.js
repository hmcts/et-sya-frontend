'use strict';
const testConfig = require('../../config.js');
const contactUs = require('../../helpers/contactUs.js');

const claimDetailsConfig = require('./claimDetails.json');
const claimDetailsContentHelper = require('./claimDetailsContentHelper');

module.exports = async function (allClaimDetailsPages) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const I = this;
  if (allClaimDetailsPages) {
    I.see('What type of discrimination are you');
    I.see('claiming?');
    I.see('What is discrimination?');
    I.see('Select all that apply.');
    I.see('Age');
    I.see('Disability');
    I.see('Gender reassignment');
    I.see('Marriage or civil partnership');
    I.see('Pregnancy or maternity');
    I.see('Race (including colour, nationality, and ethnic or national origins)');
    I.see('Religion or belief');
    I.see('Sex (including equal pay)');
    I.see('Sexual orientation');

    I.click(claimDetailsConfig.what_is_discrimination);
    I.wait(1);
    await claimDetailsContentHelper.verifyWhatIsDiscrimination();

    I.click(claimDetailsConfig.contact_us);
    I.wait(1);
    await contactUs.verifyContactUs();

    I.checkOption(claimDetailsConfig.age);
    I.checkOption(claimDetailsConfig.disability);
    I.checkOption(claimDetailsConfig.gender_reassignment);
    I.checkOption(claimDetailsConfig.marriage_or_civil_partnership);
    I.checkOption(claimDetailsConfig.pregnancy_or_maternity);
    I.checkOption(claimDetailsConfig.race);
    I.checkOption(claimDetailsConfig.religion_or_belief);
    I.checkOption(claimDetailsConfig.sex);
    I.checkOption(claimDetailsConfig.sexual_orientation);

    I.click('Save and continue');

    //What happened to you Page.
    I.see('Describe what happened to you');
    await claimDetailsContentHelper.verifyThisIsYourOppurtunityToExplain();

    //The various Links on this page...
    I.see('What to write for discrimination claims');
    I.see('What to write for dismissal claims');
    I.see('What to write for whistleblower claims');
    I.see("What to write for 'other' claims");
    I.see('Use this box to describe the events around your dispute, or add to your claim by uploading a document');
    I.see('Or upload your summary as a separate document (optional)');

    I.click(claimDetailsConfig.what_to_write_for_discrimination_claims);
    //I.wait(1); //Commenting out the Explicit Waits and seeing if this works during pipeline execution....
    await claimDetailsContentHelper.verifyWhatToWriteForDiscriminationClaims();

    I.click(claimDetailsConfig.what_to_write_for_dismissal_claims);
    //I.wait(1);  //Commenting out the Explicit Waits and seeing if this works during pipeline execution....
    await claimDetailsContentHelper.verifyWhatToWriteForDismissalClaims();

    I.click(claimDetailsConfig.what_to_write_for_whistle_blower_claims);
    //I.wait(1);  //Commenting out the Explicit Waits and seeing if this works during pipeline execution....
    await claimDetailsContentHelper.verifyWhatToWriteForWhistleBlowerClaims();

    I.click(claimDetailsConfig.what_to_write_for_other_claims);
    //I.wait(1);  //Commenting out the Explicit Waits and seeing if this works during pipeline execution....
    await claimDetailsContentHelper.verifyWhatToWriteForOtherClaims();

    I.click(claimDetailsConfig.upload_your_summary_as_a_separate);
    //I.wait(1); //Commenting out the Explicit Waits and seeing if this works during pipeline execution....
    I.see('You can only upload 1 document.');
    I.see('Upload a file');

    I.fillField(claimDetailsConfig.claim_summary_notes, 'Discrimination, Dismissal and Pay Cut.');

    I.click(claimDetailsConfig.contact_us);
    //I.wait(1); //Commenting out the Explicit Waits and seeing if this works during pipeline execution....
    await contactUs.verifyContactUs();
    I.click('Save and continue');
  }

  //If your claim was successfull page.
  await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
  await I.see('What do you want if your claim is successful? (optional)');
  await claimDetailsContentHelper.verifyWhatCanATribunalAward();

  I.click(claimDetailsConfig.compensation_what_can_a_tribunal_award);
  //I.wait(1); //Commenting out the Explicit Waits and seeing if this works during pipeline execution....
  await claimDetailsContentHelper.verifyIfATribunalDecidesYouveBeenUnfairlyDismissed();

  I.click(claimDetailsConfig.what_is_a_tribunal_recommendation);
  //I.wait(1); //Commenting out the Explicit Waits and seeing if this works during pipeline execution....
  await claimDetailsContentHelper.verifyIfYourEmployerIsFound();

  I.checkOption(claimDetailsConfig.compensation_only);
  I.checkOption(claimDetailsConfig.tribunal_recommendation);
  I.checkOption(claimDetailsConfig.get_your_old_job_back);
  I.checkOption(claimDetailsConfig.get_another_job);

  I.click(claimDetailsConfig.contact_us);
  //I.wait(1); //Commenting out the Explicit Waits and seeing if this works during pipeline execution....
  await contactUs.verifyContactUs();

  I.click('Save and continue');

  //What Compensation are you seeking...
  await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
  await I.see('What compensation are you seeking?');
  await claimDetailsContentHelper.verifyWhatCanACompensationTribunalAward();

  I.click(claimDetailsConfig.compensation_what_can_a_tribunal_award);
  //I.wait(1); //Commenting out the Explicit Waits and seeing if this works during pipeline execution....
  await claimDetailsContentHelper.verifyIfATribunalDecidesYouveBeenUnfairlyDismissed();

  I.fillField(claimDetailsConfig.compensation_outcome, 'Discrimination, Dismissal and Pay Cut.');
  I.fillField(claimDetailsConfig.compensation_amount, '1000.00');

  I.click(claimDetailsConfig.contact_us);
  //I.wait(1); //Commenting out the Explicit Waits and seeing if this works during pipeline execution....
  await contactUs.verifyContactUs();

  I.click('Save and continue');

  //What Tribunal Recommendation Page.
  await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
  await I.see('What tribunal recommendation would');
  I.see('you like to make?');
  await claimDetailsContentHelper.verifyWhatIsATribunalReccomendation();

  I.click(claimDetailsConfig.what_is_a_tribunal_recommendation);
  //I.wait(1); //Commenting out the Explicit Waits and seeing if this works during pipeline execution....
  await claimDetailsContentHelper.verifyIfYourEmployerIsFoundDiscriminated();

  I.fillField(claimDetailsConfig.tribunal_recommendation_request, 'Discrimination, Dismissal and Pay Cut.');

  I.click(claimDetailsConfig.contact_us);
  //I.wait(1); //Commenting out the Explicit Waits and seeing if this works during pipeline execution....
  await contactUs.verifyContactUs();

  I.click('Save and continue');

  await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
  I.see('Whistleblowing claims');
  await claimDetailsContentHelper.verifyWhistleBlowingClaims();

  I.checkOption(claimDetailsConfig.whistle_blowing_claims);
  I.fillField(claimDetailsConfig.whistle_blowing_entity_name, 'N/A');

  I.click(claimDetailsConfig.contact_us);
  I.wait(1);
  await contactUs.verifyContactUs();

  I.click('Save and continue');
  // Linked Cases
  await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
  await I.see('Linked cases');
  I.see('Tell us if there are any existing cases this claim could be linked to.');
  I.see('This could be:');
  I.see('a case or cases you have already brought');
  I.see('a case or cases brought by other people against the same employer with the same or similar circumstances');
  I.see('This will help the tribunal consider whether the cases should be linked in any way.');
  I.see('Are there are any existing cases which may be linked to this new claim? (Optional)');
  I.see('No');
  I.see('Yes');

  I.checkOption("//input[@id='linkedCases-2']");

  I.click("//span[contains(.,'Contact us')]");
  await contactUs.verifyContactUs();
  I.click('Save and continue');
  //Have you completed this Section
  await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
  await I.see('Have you completed this section?');
  I.see('You can change your answers later.');
  I.see("Yes, I've completed this section");
  I.see("No, I'll come back to it later");

  I.checkOption("//input[@id='claim-details-check']");

  I.click("//span[contains(.,'Contact us')]");
  //I.wait(1); //Commenting out the Explicit Waits and seeing if this works during pipeline execution....
  await contactUs.verifyContactUs();

  I.click('Save and continue');
  I.wait(5);
};

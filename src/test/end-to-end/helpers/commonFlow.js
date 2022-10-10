const { I } = inject();
const commonFlowContentHelper = require('./commonFlowContent');
const commonFlowLocators = require('./commonFlowLocators.json');
const contactUs = require('./contactUs.js');

async function initialPageFlow() {
  //Make a Claim  to an employment Tribunal Page....
  await I.amOnPage('/');
  await I.see('Make a claim to an employment tribunal');
  await commonFlowContentHelper.verifyMakeAClaimToAnEmploymentTribunal();
  await I.click('Start now');

  //Before You Continue Page....
  await I.waitForText('Before you continue', 30);
  await commonFlowContentHelper.verifyBeforeYouContinueGuidanceText();
  I.click(commonFlowLocators.contact_us);
  await contactUs.verifyContactUs();
  await I.click('Continue');

  //What is the postcode where you have worked for Page....
  I.waitForText('What’s the postcode', 30);
  I.see('where you worked or');
  I.see('work?');
  await commonFlowContentHelper.verifyWhatIsThePostcodeYouHaveWorkedForGuidanceText();
  I.see('Postcode');
  I.click(commonFlowLocators.contact_us);
  await contactUs.verifyContactUs();
  await I.fillField('#workPostcode', 'LS9 6EP');
  await I.click('Continue');
}

async function createSingleMyselfCase() {
  /* Journey for creating a case for yourself
  includes:
  * with ACAS certificate
  * type of claim = discrimination and whistleBlowing
  */
  await initialPageFlow();
  I.see('Are you making the claim for yourself,');
  I.see('or representing someone else?');
  await commonFlowContentHelper.verifyARepresentativeGuidanceText();
  I.see('Who can act as a representative?');
  I.see('How to find and get a representative?');
  I.see('I’m representing myself and making my own claim');
  I.see('I’m making a claim for someone else and acting as their representative');
  I.click(commonFlowLocators.who_can_act_as_a_representative);
  await commonFlowContentHelper.verifyWhoCanActAsARepresentativeGuidanceText();
  I.click(commonFlowLocators.how_can_i_find_and_get_a_representative);
  await commonFlowContentHelper.verifyHowToFindARepresentativeGuidanceText();
  //representing yourself
  I.click(commonFlowLocators.contact_us);
  await contactUs.verifyContactUs();
  I.checkOption('input[id=lip-or-representative]');
  I.click('Continue');

  //Are you making a claim on your own oe with others Page
  I.see('Are you making a claim on your own or with others?');
  await commonFlowContentHelper.verifyAreYouMakingAClaimOnYourOwnGuidanceText();
  I.see('I’m claiming on my own');
  I.see('I’m claiming with another person or other people');
  I.click(commonFlowLocators.contact_us);
  await contactUs.verifyContactUs();
  I.checkOption('input[id=single-or-multiple-claim]');
  I.click('Continue');

  //Do you have an ACAS Early Conciliation certificate
  I.see('Do you have an ‘Acas early conciliation');
  I.see('certificate’ for the respondent or');
  I.see("respondents you're claiming against?");
  await commonFlowContentHelper.verifyACASConciliationGuidanceText();
  I.click(commonFlowLocators.contact_us);
  await contactUs.verifyContactUs();
  //Yes Acas certificate
  I.checkOption('input[id=acas-multiple]');
  I.click('Continue');

  //Type of claim = discrimination
  I.see('What type of claim are you making?');
  I.see('You can choose all that apply to you. Further information will be asked for later in the claim.');
  I.see('Select all that apply');
  I.see('Breach of contract - including notice pay');
  I.see('Discrimination of any type');
  I.see('for example because of your sex, ethnicity, disability or other characteristic');
  I.see('Pay-related claim');
  I.see('Unfair dismissal');
  I.see('including constructive dismissal');
  I.see('Whistleblowing');
  I.see('including dismissal or any other unfair treatment after whistleblowing');
  I.see('Other type of claim');
  I.click(commonFlowLocators.contact_us);
  await contactUs.verifyContactUs();
  I.checkOption('input[value=discrimination]');
  I.checkOption('input[value=whistleBlowing]');
  I.click('#main-form-submit');
}

module.exports = { initialPageFlow, createSingleMyselfCase };

const { I } = inject();
const commonFlowContentHelper = require('./commonFlowContent');
const contactUs = require('./contactUs.js');

async function initialPageFlow() {
  //Make a Claim  to an employment Tribunal Page....
  await I.amOnPage('/');
  await I.see('Make a claim to an employment tribunal');
  await commonFlowContentHelper.verifyMakeAClaimToAnEmploymentTribunal();
  await I.click('Start now');

  //Before You Continue Page....
  await I.see('Before you continue');
  await commonFlowContentHelper.verifyBeforeYouContinueGuidanceText();
  I.click("//span[contains(text(),'Contact us')]");
  await contactUs.verifyContactUs();
  await I.click('Continue');

  //What is the postcode where you have worked for Page....
  I.see('What’s the postcode');
  I.see('where you worked or');
  I.see('work?');
  await commonFlowContentHelper.verifyWhatIsThePostcodeYouHaveWorkedForGuidanceText();
  I.see('Postcode');
  I.click("//span[contains(text(),'Contact us')]");
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
  //representing yourself
  I.checkOption('input[id=lip-or-representative]');
  I.click('Continue');
  //Claiming on my own
  I.see('Are you making a claim on your own or with others?');
  I.checkOption('input[id=single-or-multiple-claim]');
  I.click('Continue');
  //Yes Acas certificate
  I.checkOption('input[id=acas-multiple]');
  I.click('Continue');
  //Type of claim = discrimination
  I.checkOption('input[value=discrimination]');
  I.checkOption('input[value=whistleBlowing]');
  I.click('#main-form-submit');
}

module.exports = { initialPageFlow, createSingleMyselfCase };

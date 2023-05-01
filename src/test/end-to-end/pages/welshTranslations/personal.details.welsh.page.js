const commonConfig = require('../../features/Data/commonConfig.json');
const { I } = inject();

module.exports = {
  async processPersonalDetails() {
    this.clickPersonalDetailsLink();
    this.enterDob();
    this.selectSexAndTitle();
    this.enterPostcode();
    this.enterTelephoneNumber();
    this.selectHowToBeContacted();
    this.selectHearingPreference();
    this.selectReasonableAdjustment();
    this.confirmCompletedPersonalDetailsQuestions();
  },
  //click personal details link and enter details
  clickPersonalDetailsLink() {
    I.click('[href="/dob-details?lng=cy"]');
  },
  enterDob() {
    //enter date of birth
    I.waitForText('What is your date of birth?', 30);
    I.fillField('#dobDate-day', '01');
    I.fillField('#dobDate-month', '01');
    I.fillField('#dobDate-year', '1989');
    I.click('Save and continue');
  },
  selectSexAndTitle() {
    //select sex and enter title
    I.waitForText('Sex and preferred title', 30);
    I.checkOption('#sex');
    I.fillField('#preferredTitle', 'Mr');
    I.click('Save and continue');
  },
  enterPostcode() {
    //Enter postcode for claimant address
    I.see('Enter a UK postcode');
    I.refreshPage();
    I.fillField('#enterPostcode', 'LS9 9HE');
    I.click(commonConfig.saveAndContinue);
    I.waitForVisible('#addressTypes', 30);
    I.selectOption('#addressTypes', 'Apartment 1001, Millennium Tower, 250, The Quays, Salford, M50 3SB');
    I.see('Apartment 1001, Millennium Tower, 250, The Quays, Salford, M50 3SB');
    I.refreshPage();
    I.click(commonConfig.saveAndContinue);
  },
  enterTelephoneNumber() {
    //Enter telephone number
    I.waitForText('What is your telephone number?', 30);
    I.fillField('#telephone-number', '07898787676');
    I.click('Save and continue');
  },
  selectHowToBeContacted() {
    //select option for how to be contacted
    I.waitForText('How would you like to be contacted', 30);
    I.see(' about your claim?');
    I.checkOption('#update-preference');
    I.click('Save and continue');
  },
  selectHearingPreference() {
    //Select hearing preference option - video hearing
    I.waitForText('Would you be able to take part in hearings by', 30);
    I.see('video and phone?');
    I.checkOption('#hearingPreferences');
    I.click('Save and continue');
  },
  selectReasonableAdjustment() {
    //Select No to reasonable adjustment question
    I.waitForText('Do you have a physical, mental or learning', 30);
    I.see('disability or long term health condition that');
    I.see('means you need support during your case?');
    I.checkOption('#reasonableAdjustments-2');
    I.click('Save and continue');
  },
  confirmCompletedPersonalDetailsQuestions() {
    //confirm completed personal details question
    I.waitForText('Have you completed this', 30);
    I.see('section?');
    I.checkOption('#tasklist-check');
    I.click('Save and continue');
    I.see('Steps to making your claim');
  },
};

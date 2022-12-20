const { I } = inject();

module.exports = {
  processStillWorkingJourney() {
    this.clickEmploymentStatusLink();
    this.workedForOrganisation();
    this.stillWorkingForOrganisation();
    this.enterEmploymentJobTitle();
    this.enterEmploymentStartDate();
    this.selectYesNoticePeriod();
    this.selectNoticeType();
    this.enterNoticePeriodLength();
    this.enterAverageWeeklyHours();
    this.enterPay();
    this.enterPensionContribution();
    this.enterEmployeeBenefits();
    this.enterRespondentName();
    this.enterRespondentAddress();
    this.selectYesToWorkingAtRespondentAddress();
    this.selectNoToAcas();
    this.checkRespondentDetails();
    this.completeEmploymentAndRespondentDetails();
  },
  //clicks employment status link
  clickEmploymentStatusLink() {
    I.click('[href="/past-employer?lng=cy"]');
    I.waitForText('A wnaethoch wei', 30);
    I.see('thio i’r sefydliad');
    I.see('neu’r unigolyn ry');
    I.see('dych yn gwneud');
    I.see('hawliad yn ei');
    I.see('erbyn?');
  },

  //function to click yes worked for organisation on /past-employer page
  workedForOrganisation() {
    I.click('#past-employer');
    I.click('Cadw a pharhau');
  },
  //selects still working for respondent on /are-you-still-working page
  stillWorkingForOrganisation() {
    I.waitForText(
      'Ydych chi dal i weithio i’r sefydliad neu’r unigolyn rydych yn gwneud eich hawliad yn ei erbyn?',
      30
    );
    I.click('#still-working');
    I.click('Cadw a pharhau');
  },
  //check page title and enter job title
  enterEmploymentJobTitle() {
    I.waitForText('Manylion cyflogaeth', 30);
    I.seeElement('#jobTitle');
    I.fillField('#jobTitle', 'Tester');
    I.click('Cadw a pharhau');
  },
  //employment start date page
  enterEmploymentStartDate() {
    I.waitForText('Dyddiad cychwyn y gyflogaeth', 30);
    I.fillField('#startDate-day', '20');
    I.fillField('#startDate-month', '04');
    I.fillField('#startDate-year', '2014');
    I.click('Cadw a pharhau');
  },
  //select yes to notice period on /got-a-notice-period page
  selectYesNoticePeriod() {
    I.waitForText('Welsh Translation required', 30);
    I.checkOption('input[id=notice-period]');
    I.click('Cadw a pharhau');
  },
  //select weeks for notice type on /notice-type page
  selectNoticeType() {
    I.waitForText('A yw eich cyfnod rhybudd yn wythnosau ynteu’n fisoedd? (dewisol)\n', 30);
    I.checkOption('input[id=notice-type]');
    I.click('Cadw a pharhau');
  },
  //enter notice length on /notice-length page
  enterNoticePeriodLength() {
    I.waitForText('Er enghraifft, 4', 30);
    I.fillField('input[id=notice-length]', '4');
    I.click('Cadw a pharhau');
  },
  //enter average weekly hours
  enterAverageWeeklyHours() {
    I.waitForText('Beth yw eich oriau gwaith ar gyfartaledd bob wythnos? (dewisol)', 30);
    I.fillField('#avg-weekly-hrs', '20');
    I.click('Cadw a pharhau');
  },
  //enters pay on the /pay page
  enterPay() {
    I.waitForText('Eich cyflog (dewisol)', 30);
    I.fillField('#pay-before-tax', '40000');
    I.fillField('#pay-after-tax', '35000');
    I.checkOption('input[id=pay-interval]');
    I.click('Cadw a pharhau');
  },
  //enter Pension contribution on /pension page
  enterPensionContribution() {
    I.waitForText('A wnaeth yr atebydd unrhyw gyfraniadau i’ch pensiwn? (dewisol)', 30);
    I.waitForElement('#pension', 30);
    I.checkOption('input[id=pension]');
    I.fillField('#pension-contributions', '200');
    I.click('Cadw a pharhau');
  },
  //enter employee benefits on /benefits page
  enterEmployeeBenefits() {
    I.waitForText('Er enghraifft, gofal plant, car cwmni, yswiriant tŷ,', 30);
    I.checkOption('input[id=employee-benefits]');
    I.click('Cadw a pharhau');
  },
  //verify user is on respondent-name page and then enters a respondent name
  enterRespondentName() {
    I.waitForText('Beth yw enw’r atebydd rydych yn gwneud yr hawliad yn ei erbyn?', 30);
    I.fillField('#respondentName', 'Henry Marsh');
    I.click('Cadw a pharhau');
  },
  //enters address for respondent
  enterRespondentAddress() {
    I.waitForText('Beth yw cyfeiriad Henry Marsh?', 30);
    I.fillField('#postcode', 'LS7 4QE');
    I.click('#findAddressButton');
    I.waitForVisible('#selectAddressInput', 30);
    I.selectOption(
      '#selectAddressInput',
      '{"fullAddress":"7, VALLEY GARDENS, LEEDS, LS7 4QE","street1":"7 VALLEY GARDENS","street2":"","town":"LEEDS","county":"LEEDS","postcode":"LS7 4QE","country":"ENGLAND"}'
    );
    I.click('Cadw a pharhau');
  },
  //selects yes to working at respondent address
  selectYesToWorkingAtRespondentAddress() {
    I.waitForText('Welsh Translation required 7 VALLEY GARDENS?', 30);
    I.checkOption('#work-address');
    I.click('Cadw a pharhau');
  },
  //selects no option for acas cerificate question on /acas-cer-num page
  selectNoToAcas() {
    I.waitForText('A oes gennych rif tystysgrif ACAS ar gyfer', 30);
    I.checkOption('#acasCert-2');
    I.click('Cadw a pharhau');
    I.see('Welsh Translation required');
    I.checkOption('#no-acas-reason');
    I.click('Cadw a pharhau');
  },
  //check respondent details page
  checkRespondentDetails() {
    I.waitForText('Gwiriwch fanylion yr atebydd', 30);
    I.click('Cadw a pharhau');
  },
  //confirm completed section for employment and respondent details
  completeEmploymentAndRespondentDetails() {
    I.waitForText('Ydych chi wedi cwblhau’r adran hon?\n', 30);
    I.waitForElement('#tasklist-check', 30);
    I.checkOption('#tasklist-check');
    I.click('Cadw a pharhau');
  },
};

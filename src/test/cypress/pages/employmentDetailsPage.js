/* eslint-enable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

const today = new Date();
const startDateDay = today.getDate() + 1;
const startMonth = today.getMonth() + 1;
const startYear = today.getFullYear() - 10;
const noticeYear = today.getFullYear() + 1;
const newJobMonth = today.getMonth() - 2;
const employmentEndYear = today.getFullYear() - 1;

class EmploymentDetailsPage {

  // eslint-disable-next-line prettier/prettier
    workingForEmployer(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('#still-working');
    }
    workingNotice(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('#notice-type');
    }
    noLongerWorkingForEmployer(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('#still-working-3');
    }
    continueToNextPageButton(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('#main-form-submit');
    }
    jobTitleTextField(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('#jobTitle');
    }
    enterEmploymentStartDateDay(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('#startDate-day');
    }
    enterEmploymentStartDateMonth(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('#startDate-month');
    }
    enterEmploymentStartDateYear(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('#startDate-year');
    }
    weeklyNoticeOption(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('input[id=notice-type]');
    }
    monthlyNoticeOption(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('input[id=notice-type-2]');
    }
    enterEmploymentEndDateDay(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('#endDate-day');
    }
    enterEmploymentEndDateMonth(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('#endDate-month');
    }
    enterEmploymentEndDateYear(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('#endDate-year');
    }
    enterEmploymentNoticePeriodDay(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('#notice-dates-day');
    }
    enterEmploymentNoticePeriodMonth(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('#notice-dates-month');
    }
    enterEmploymentNoticePeriodYear(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('#notice-dates-year');
    }
    noticePeriod_Yes(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('input[id=notice-period]');
    }
    noticePeriod_No(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('input[id=notice-period-2]');
    }
    noticePeriodTextField(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('#notice-length');
    }
    weeklyHoursTextField(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('#avg-weekly-hrs');
    }
    payPackageBeforeTaxTextField(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('#pay-before-tax');
    }
    payPacKageAfterTaxTextField(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('#pay-after-tax');
    }
    payFrequency(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('input[id=pay-interval]');
    }
    employmentStatusLink(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('[href="/employment-status?lng=en"]');
    }
    didYouWorkForOrg_Yes(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('input[id=past-employer]');
    }
    didYouWorkForOrg_No(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('input[id=past-employer-2]');
    }
    pensionCheckBox(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('input[id=pension]');
    }
    pensionTextField(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('#pension-contributions');
    }
    newJobOptions(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('input[id=new-job]');
    }
    newJobStartDateDay(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('#new-job-start-date-day');
    }
    newJobStartDateMonth(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('#new-job-start-date-month');
    }
    newJobStartDateYear(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('#new-job-start-date-year');
    }
    newJobPayDetailsTextField(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('#new-pay-before-tax');
    }
    newJobPayInterval(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('#new-job-pay-interval-3');
    }
    respondentName(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('#respondent-name');
    }
    respondentPostcode(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('#respondentEnterPostcode');
    }
    respondentAddressDropdown(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('#respondentAddressTypes');
    }
    populatedWorkAddress(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('#work-address');
    }
    acasNoOption(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('#acasCert-2');
    }
    reasonForNotHavingAcas(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('#no-acas-reason');
    }
    acasYesOption(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('#acasCert');
    }
    acasNumberTextField(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('#acasCertNum');
    }
    taskListCheck(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('#tasklist-check');
    }
    claimantEmploymentBenefit(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('input[id=employee-benefits]');
    }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  async completeEmploymentDetailsSection(workForOrgOption) {
    await this.employmentStatusLink().should('be.visible');
    await this.employmentStatusLink().click();
    await cy.contains('Did you work for the organisation or person you’re making your claim against?');
    switch (workForOrgOption) {
      case 'Yes':
        await this.didYouWorkForOrg_Yes().check();
        break;
      case 'No':
        await this.didYouWorkForOrg_No().check();
        break;
      default:
        throw new Error('Invalid work for organisation option provided');
    }
    await this.continueToNextPageButton().click();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  async workedForOrganisation() {
    await this.workingForEmployer().should('be.visible');
    await cy.contains("Are you still working for the organisation or person you're making your claim against?");
    await this.workingForEmployer().click();
    await this.continueToNextPageButton().click();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  async workedForOrganisationNoticePeriod() {
    await this.workingNotice().should('be.visible');
    await cy.contains("Are you still working for the organisation or person you're making your claim against?");
    await this.workingNotice().click();
    await this.continueToNextPageButton().click();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  async noLongerWorkingForOrganisation() {
    await this.noLongerWorkingForEmployer().should('be.visible');
    await cy.contains("Are you still working for the organisation or person you're making your claim against?");
    await this.noLongerWorkingForEmployer().click();
    await this.continueToNextPageButton().click();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  async employmentStartDate() {
    await this.enterEmploymentStartDateDay().should('be.visible');
    await this.enterEmploymentStartDateDay().type(startDateDay);
    await this.enterEmploymentStartDateMonth().type(startMonth);
    await this.enterEmploymentStartDateYear().type(startYear);
    await this.continueToNextPageButton().click();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  async employmentEndDate() {
    await this.enterEmploymentEndDateDay().should('be.visible');
    await this.enterEmploymentEndDateDay().type(startDateDay);
    await this.enterEmploymentEndDateMonth().type(startMonth);
    await this.enterEmploymentEndDateYear().type(employmentEndYear);
    await this.continueToNextPageButton().click();
  }

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  async employmentJobTitle() {
    await this.jobTitleTextField().should('be.visible');
    await this.jobTitleTextField().type('QA Engineer');
    await this.continueToNextPageButton().click();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  async yesToNoticePeriod() {
    await this.noticePeriod_Yes().should('be.visible');
    await cy.contains('Do you have a written contract with a notice period? (optional)');
    await this.noticePeriod_Yes().check();
    await this.continueToNextPageButton().click();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  async noToNoticePeriod() {
    await this.noticePeriod_No().should('be.visible');
    await cy.contains('Do you have a written contract with a notice period? (optional)');
    await this.noticePeriod_No().check();
    await this.continueToNextPageButton().click();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  async noticePeriodType(noticeOptions) {
    switch (noticeOptions) {
      case 'Weekly':
        await this.weeklyNoticeOption().should('be.visible');
        await this.weeklyNoticeOption().check();
        await this.continueToNextPageButton().click();
        await this.noticePeriodTextField().type('44');
        break;
      case 'Monthly':
        await this.monthlyNoticeOption().should('be.visible');
        await this.monthlyNoticeOption().check();
        await this.continueToNextPageButton().click();
        await this.noticePeriodTextField().type('91');
        break;
      default:
        throw new Error('Invalid notice period type provided');
    }
    await this.continueToNextPageButton().click();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  async noticePeriodEndDate() {
    await this.enterEmploymentNoticePeriodDay().should('be.visible');
    await this.enterEmploymentNoticePeriodDay().type(startDateDay);
    await this.enterEmploymentNoticePeriodMonth().type(startMonth);
    await this.enterEmploymentNoticePeriodYear().type(noticeYear);
    await this.continueToNextPageButton().click();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  async weeklyHours() {
    await this.weeklyHoursTextField().should('be.visible');
    await cy.contains('What were your average weekly hours? (optional)');
    await this.weeklyHoursTextField().type('30');
    await this.continueToNextPageButton().click();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  async verifyEmploymentStatusIsDisplayed(workStatus) {
    await this.workingForEmployer().should('be.visible');
    await cy.contains('Are you still working for this employer?');
    switch (workStatus) {
      case 'Still working for respondent':
        await this.workingForEmployer().check();
        break;
      case 'Working Notice Period for respondent':
        await this.workingNotice().check;
        break;
      case 'No Longer working for respondent':
        await this.noLongerWorkingForEmployer().check();
        break;
      default:
        throw new Error('Invalid work status provided');
    }
    await this.continueToNextPageButton().click();
    await cy.contains('Employment details');
    this.jobTitleTextField().should('be.visible');
    await this.jobTitleTextField().type('QA Engineer');
    await this.continueToNextPageButton().click();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  async completeHoursAndEarningsDetails() {
    await this.weeklyHoursTextField().should('be.visible');
    await this.weeklyHoursTextField().type('35');
    await this.continueToNextPageButton().click();
    await this.payPackageBeforeTaxTextField().should('be.visible');
    await this.payPackageBeforeTaxTextField().type('250000');
    await this.payPacKageAfterTaxTextField().type('30000');
    await this.payFrequency().check();
    await this.continueToNextPageButton().click();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  async enterPensionContributions() {
    await this.pensionCheckBox().should('be.visible');
    await cy.contains('Did the respondent make any contributions to your pension? (optional)');
    await this.pensionCheckBox().check();
    await this.pensionTextField().type('5000');
    await this.continueToNextPageButton().click();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  async claimantGotNewJob() {
    await this.newJobOptions().should('be.visible');
    await this.newJobOptions().check();
    await this.continueToNextPageButton().click();
    await this.newJobStartDateDay().type(startDateDay);
    await this.newJobStartDateMonth().type(newJobMonth);
    await this.newJobStartDateYear().type(startYear);
    await this.continueToNextPageButton().click();
    await this.newJobPayDetailsTextField().should('be.visible');
    await this.newJobPayDetailsTextField().type('250000');
    await this.newJobPayInterval().check();
    await this.continueToNextPageButton().click();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  async respondentNameDetails() {
    await this.respondentName().should('be.visible');
    await cy.contains("What is the name of the respondent you're making the claim against?");
    await this.respondentName().type('Henry Marsh');
    await this.continueToNextPageButton().click();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  async respondentAddressDetails(workPostCode, selectedWorkAddress) {
    await this.respondentPostcode().should('be.visible');
    await cy.contains("What is the respondent's address?");
    await this.respondentPostcode().type(workPostCode);
    await this.continueToNextPageButton().click();
    await this.respondentAddressDropdown().should('be.visible');
    await cy.contains('Select an address');
    await this.respondentAddressDropdown().select(selectedWorkAddress);
    await this.continueToNextPageButton().click();
    await cy.contains('This should be the same respondent address given to Acas.');
    await this.continueToNextPageButton().click();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  async selectYesToWorkingAtRespondentAddress(firstLineOfAddress) {
    await cy.contains(firstLineOfAddress);
    await this.populatedWorkAddress().check();
    await this.continueToNextPageButton().click();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  async employmentBenefits() {
    await cy.contains('Do you or did you receive any employee benefits? (optional)');
    await this.claimantEmploymentBenefit().check();
    await this.continueToNextPageButton().click();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  async selectNoToAcas() {
    await this.acasNoOption().should('be.visible');
    await cy.contains('Do you have an Acas certificate number for Henry Marsh?');
    await this.acasNoOption().check();
    await this.continueToNextPageButton().click();
    await cy.contains('Why do you not have an Acas number?');
    await this.reasonForNotHavingAcas().check();
    await this.continueToNextPageButton().click();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  async selectYesToAcas() {
    await this.acasYesOption().should('be.visible');
    await cy.contains('Do you have an Acas certificate number for Henry Marsh?');
    await this.acasYesOption().check();
    await this.acasNumberTextField().type('R444444/89/74');
    await this.continueToNextPageButton().click();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  async completeEmploymentAndRespondentDetails() {
    await cy.contains('Check the respondent details');
    await this.continueToNextPageButton().click();
    await this.taskListCheck().should('be.visible');
    await cy.contains('Have you completed this section?');
    await this.taskListCheck().check();
    await this.continueToNextPageButton().click();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  async completeStillWorkingJourney(
    workForOrgOption,
    workStatus,
    noticeOptions,
    workPostCode,
    selectedWorkAddress,
    firstLineOfAddress
  ) {
    await this.completeEmploymentDetailsSection(workForOrgOption);
    await this.verifyEmploymentStatusIsDisplayed(workStatus);
    await this.workedForOrganisation();
    await this.employmentJobTitle();
    await this.employmentStartDate();
    await this.yesToNoticePeriod();
    await this.noticePeriodType(noticeOptions);
    await this.weeklyHours();
    await this.completeHoursAndEarningsDetails();
    await this.enterPensionContributions();
    await this.employmentBenefits();
    await this.respondentNameDetails();
    await this.respondentAddressDetails(workPostCode, selectedWorkAddress);
    await this.selectYesToWorkingAtRespondentAddress(firstLineOfAddress);
    await this.selectYesToAcas();
    await this.completeEmploymentAndRespondentDetails();
  }
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  async completeStillWorkingNoticePeriodJourney(
    workForOrgOption,
    workStatus,
    noticeOptions,
    workPostCode,
    selectedWorkAddress,
    firstLineOfAddress
  ) {
    await this.completeEmploymentDetailsSection(workForOrgOption);
    await this.verifyEmploymentStatusIsDisplayed(workStatus);
    await this.workedForOrganisationNoticePeriod();
    await this.employmentJobTitle();
    await this.employmentStartDate();
    await this.noticePeriodEndDate();
    await this.noticePeriodType(noticeOptions);
    await this.weeklyHours();
    await this.completeHoursAndEarningsDetails();
    await this.enterPensionContributions();
    await this.employmentBenefits();
    await this.respondentNameDetails();
    await this.respondentAddressDetails(workPostCode, selectedWorkAddress);
    await this.selectYesToWorkingAtRespondentAddress(firstLineOfAddress);
    await this.selectYesToAcas();
    await this.completeEmploymentAndRespondentDetails();
  }
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  async completeNoLongerWorkingJourney(
    workForOrgOption,
    workStatus,
    noticeOptions,
    workPostCode,
    selectedWorkAddress,
    firstLineOfAddress
  ) {
    await this.completeEmploymentDetailsSection(workForOrgOption);
    await this.verifyEmploymentStatusIsDisplayed(workStatus);
    await this.noLongerWorkingForOrganisation();
    await this.employmentJobTitle();
    await this.employmentStartDate();
    await this.employmentEndDate();
    await this.yesToNoticePeriod();
    await this.noticePeriodType(noticeOptions);
    await this.weeklyHours();
    await this.completeHoursAndEarningsDetails();
    await this.enterPensionContributions();
    await this.employmentBenefits();
    await this.claimantGotNewJob();
    await this.respondentNameDetails();
    await this.respondentAddressDetails(workPostCode, selectedWorkAddress);
    await this.selectYesToWorkingAtRespondentAddress(firstLineOfAddress);
    await this.selectYesToAcas();
    await this.completeEmploymentAndRespondentDetails();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  async completeDidNotworkForOrganisationMakingClaimAgainst(workForOrgOption) {
    await this.completeEmploymentDetailsSection(workForOrgOption);
    await this.respondentNameDetails();
    await this.selectNoToAcas();
    await this.completeEmploymentAndRespondentDetails();
  }
}

/* eslint-enable @typescript-eslint/explicit-module-boundary-types */
export default EmploymentDetailsPage;

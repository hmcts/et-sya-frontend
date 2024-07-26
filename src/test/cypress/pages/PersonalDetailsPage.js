/* eslint-enable @typescript-eslint/explicit-module-boundary-types */

class PersonalDetailsPage {
  // eslint-disable-next-line prettier/prettier
    preliminaryText() {
    return cy.get('.govuk-panel__title');
  }
  dayofBirth() {
    return cy.get('#dobDate-day').first();
  }
  monthofBirth() {
    return cy.get('#dobDate-month').first();
  }
  yearofBirth() {
    return cy.get('#dobDate-year').first();
  }
  saveAndContinue() {
    return cy.get('#main-form-submit');
  }
  continueToSteps() {
    return cy.get('//a[contains(.,"Continue")]');
  }
  sexOptionMale() {
    return cy.get('sex');
  }
  sexOptionFemale() {
    return cy.get('sex-2');
  }
  sexOptionPreferNotToSay() {
    return cy.get('sex-3');
  }
  titlePrefrenceTextFeild() {
    return cy.get('#preferredTitle');
  }
  claimantPostCode() {
    return cy.get('#addressEnterPostcode');
  }
  addressTypeDropDown() {
    return cy.get('#addressAddressTypes');
  }
  claimantAddressLineTwo() {
    return cy.get('#address2');
  }
  claimantAddressLineOne() {
    return cy.get('#address1');
  }
  addressTown() {
    return cy.get('#addressTown');
  }
  addressCountry() {
    return cy.get('#addressCountry');
  }
  addressPostcode() {
    return cy.get('#addressPostcode');
  }
  updatePreferencesOption2() {
    return cy.get('#update-preference-2');
  }
  languagePreferenceOption2() {
    return cy.get('#update-preference-language-2');
  }
  hearingPreferenceLanguageOption2() {
    return cy.get('#update-hearing-language-2');
  }
  hearingPreference() {
    return cy.get('#hearingPreferences');
  }
  contactUSText() {
    return cy.get('//span[contains(text(),"Contact us")]');
  }
  noToReasonableAdjustment() {
    return cy.get('#reasonableAdjustments-2');
  }
  taskListCheck() {
    return cy.get('#tasklist-check');
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  async prePersonalDetailsFlow() {
    await this.preliminaryText().should('be.visible');
    this.preliminaryText().should('contain.text', 'You do not have to complete your claim in one go');
    return this.continueToSteps().click();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  async completePersonalDetail() {
    await this.preliminaryText().should('be.visible');
    await this.preliminaryText().should('contain.text', 'You do not have to complete your claim in one go');
    await this.saveAndContinue().click();
    await this.dayofBirth().type('01');
    await this.monthofBirth().type('01');
    await this.yearofBirth().type('2000');
    await this.dayofBirth().should('have.value', '01');
    await this.monthofBirth().should('have.value', '01');
    await this.yearofBirth().should('have.value', '2000');
    await this.saveAndContinue().click();
    await this.preliminaryText().should('be.visible');
    await this.preliminaryText().should('contain.text', 'Sex and preferred title');
    await this.sexOptionMale().check();
    await this.sexOptionMale().should('be.checked');
    await this.sexOptionFemale().should('not.be.checked');
    await this.sexOptionPreferNotToSay().should('not.be.checked');
    await this.titlePrefrenceTextFeild().type('knight');
    await this.saveAndContinue().click();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  async completeClaimantHomeAddress() {
    await this.claimantPostCode().should('be.visible');
    await this.claimantPostCode().type('LS9 9HC');
    await this.saveAndContinue().click();
    await cy.contains('Select an address');
    await cy.contains('No addresses found');
    await this.saveAndContinue().click();
    await this.addressTypeDropDown().should('be.visible');
    //await this.elements.addressTypeDropDown().select('Home');
    await this.claimantAddressLineOne().type('3 Skelton Avenue');
    await this.claimantAddressLineTwo().type('');
    await this.addressTown().type('Leeds');
    await this.addressCountry().type('England');
    await this.addressPostcode().type('LS9 9HE');
    await this.saveAndContinue().click();
    await cy.contains('What is your telephone number?');
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  async completeCommunicationPreference() {
    await cy.contains('Communication preference');
    await cy.contains('What format would you like to be contacted in?');
    await cy.contains('Email');
    await cy.contains('Post');
    await cy.contains('What language do you want us to use when we contact you?');
    await cy.contains('English');
    await cy.contains('Welsh');
    await cy.contains('If a hearing is required, what language do you want to speak at a hearing?');
    await cy.contains('English');
    await cy.contains('Welsh');
    await this.updatePreferencesOption2().check();
    await this.languagePreferenceOption2().check();
    await this.hearingPreferenceLanguageOption2().check();
    await this.saveAndContinue().click();
    await this.contactUSText().should('be.visible');
    await cy.contains(
      'Do you have a physical, mental or learning disability or long term health condition that means you need support during your case?'
    );
    await this.noToReasonableAdjustment().check();
    await this.saveAndContinue().click();
    await cy.contains('Have you completed this section?');
    await this.taskListCheck().check();
    await this.saveAndContinue().click();
  }
}

/* eslint-enable @typescript-eslint/explicit-module-boundary-types */
export default PersonalDetailsPage;
